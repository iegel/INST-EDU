import Alumno from "../models/alumno.model.js";
import User from "../models/user.model.js";
import Comision from "../models/comision.model.js";
import Calificacion from "../models/calificacion.model.js";
import Materia from "../models/materia.model.js";

// Lista de alumnos.
// - Si el usuario es Preceptor: solo alumnos de sus comisiones.
// - Si es Admin u otro rol: lista completa.
// Además, calcula el promedio y si puede promocionar cada alumno.
export const getAlumnos = async (req, res) => {
  try {
    // Usuario logueado (viene del token)
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    let filtro = {};

    // Si es Preceptor → solo alumnos de sus comisiones
    if (user.role === "Preceptor") {
      // Busco las comisiones donde este usuario es el preceptor
      const comisiones = await Comision.find({ preceptor: user._id });

      if (comisiones.length === 0) {
        // No tiene cursos asignados → no ve alumnos
        return res.json([]);
      }

      // Me quedo con el número de comisión (1A, 2B, etc.)
      const cursos = comisiones.map((c) => c.numeroComision);

      // Filtro alumnos que pertenecen a esas comisiones
      filtro.comision = { $in: cursos };
    }

    // Si es Admin, filtro queda vacío y trae todos
    const alumnos = await Alumno.find(filtro);

    // Para cada alumno, calculo promedio y si puede promocionar
    const alumnosConPromedio = await Promise.all(
      alumnos.map(async (a) => {
        const { promedio, puedePromocionar } =
          await calcularPromedioYPromocion(a);

        return {
          ...a.toObject(),
          promedio,
          puedePromocionar,
        };
      })
    );

    return res.json(alumnosConPromedio);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener la lista de alumnos" });
  }
};

// Crear un nuevo alumno
export const createAlumno = async (req, res) => {
  try {
    const { nombre, apellido, dni, comision, egresado } = req.body;

    // Validación simple por si algo se escapó del esquema
    if (!nombre || !apellido || !dni || !comision) {
      return res.status(400).json({
        message: "Nombre, apellido, DNI y comisión son obligatorios",
      });
    }

    const newAlumno = new Alumno({
      nombre,
      apellido,
      dni,
      comision,
      // Por defecto egresado es false, pero se puede sobreescribir
      egresado: egresado ?? false,
    });

    await newAlumno.save();

    return res.status(201).json(newAlumno);
  } catch (error) {
    console.error("Error al crear alumno:", error);
    return res.status(500).json({ message: "Error al crear alumno" });
  }
};

// Obtener un alumno puntual por id
// Si el usuario es Preceptor, se controla que el alumno pertenezca a una
// comisión donde él sea preceptor.
export const getAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Si es Preceptor, validamos que el alumno sea de alguna de sus comisiones
    if (user.role === "Preceptor") {
      const comisiones = await Comision.find({ preceptor: user._id });
      const cursos = comisiones.map((c) => c.numeroComision);

      if (!cursos.includes(alumno.comision)) {
        return res.status(403).json({
          message: "No tiene permiso para ver este alumno",
        });
      }
    }

    return res.json(alumno);
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el alumno" });
  }
};

// Actualizar datos de un alumno
export const updateAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni, comision, egresado } = req.body;

    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Actualizamos solo los campos enviados
    alumno.nombre = nombre ?? alumno.nombre;
    alumno.apellido = apellido ?? alumno.apellido;
    alumno.dni = dni ?? alumno.dni;
    if (comision) alumno.comision = comision;

    if (typeof egresado === "boolean") {
      alumno.egresado = egresado;
    }

    const updated = await alumno.save();
    return res.json(updated);
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    return res.status(500).json({ message: "Error al actualizar alumno" });
  }
};

// Borrar un alumno por id
export const deleteAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndDelete(req.params.id);
    if (!alumno)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // 204 = borrado sin contenido
    return res.sendStatus(204);
  } catch (error) {
    // Si algo falla, devuelvo 404 por simplicidad
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
};

// Promociona una lista de alumnos a la siguiente comisión,
// o los marca como egresados si ya están en el último año.
export const promoteAlumnos = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Debes enviar un array de IDs de alumnos" });
    }

    // Usuario logueado
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Si es Preceptor, obtenemos sus comisiones para filtrar permisos
    let cursosPermitidos = [];
    if (user.role === "Preceptor") {
      const comisiones = await Comision.find({ preceptor: user._id });
      cursosPermitidos = comisiones.map((c) => c.numeroComision);
    }

    const alumnos = await Alumno.find({ _id: { $in: ids } });

    let updatedCount = 0;
    const skipped = [];

    for (const alumno of alumnos) {
      // 1) Permisos: preceptor solo puede promocionar sus propios alumnos
      if (
        user.role === "Preceptor" &&
        !cursosPermitidos.includes(alumno.comision)
      ) {
        skipped.push({
          alumnoId: alumno._id,
          dni: alumno.dni,
          reason: "No tiene permiso sobre este alumno",
        });
        continue;
      }

      // 2) Obtener comisión actual
      const comisionActual = await Comision.findOne({
        numeroComision: alumno.comision,
      });

      if (!comisionActual) {
        skipped.push({
          alumnoId: alumno._id,
          dni: alumno.dni,
          reason: "Comisión actual no encontrada",
        });
        continue;
      }

      // 3) Calcular promedio y si puede promocionar
      const { promedio, puedePromocionar } =
        await calcularPromedioYPromocion(alumno);

      if (!puedePromocionar) {
        skipped.push({
          alumnoId: alumno._id,
          dni: alumno.dni,
          reason:
            "No aprueba todas las materias con 6 o más o faltan notas",
        });
        continue;
      }

      // 4) Si está en último año (ej: 5°), lo marcamos como egresado
      if (comisionActual.anio >= 5) {
        alumno.egresado = true;
        await alumno.save();
        updatedCount++;
        continue;
      }

      // 5) Buscar comisión del año siguiente
      const anioSiguiente = comisionActual.anio + 1;

      const comisionSiguiente = await Comision.findOne({
        anio: anioSiguiente,
        curso: comisionActual.curso,
      });

      if (!comisionSiguiente) {
        skipped.push({
          alumnoId: alumno._id,
          dni: alumno.dni,
          reason:
            "No existe comisión del año siguiente para este curso (ej: no existe 3A o 4B)",
        });
        continue;
      }

      // 6) Actualizar comisión del alumno a la del año siguiente
      alumno.comision = comisionSiguiente.numeroComision;
      await alumno.save();

      updatedCount++;
    }

    return res.json({
      updatedCount,
      skippedCount: skipped.length,
      skipped,
      message: `Se promocionaron ${updatedCount} alumno(s). ${skipped.length} no se pudieron promocionar.`,
    });
  } catch (error) {
    console.error("Error al promocionar alumnos:", error);
    return res.status(500).json({
      message: "Error al promocionar alumnos",
      error: error.message,
    });
  }
};

// Calcula el promedio de un alumno en su comisión actual y determina
// si puede promocionar (todas las materias aprobadas con nota final >= 6).
export async function calcularPromedioYPromocion(alumno) {
  // 1) Buscar materias de la comisión actual del alumno
  const materias = await Materia.find({ comision: alumno.comision });
  const totalMaterias = materias.length;

  if (totalMaterias === 0) {
    return { promedio: null, puedePromocionar: false };
  }

  // 2) Traer TODAS las calificaciones de ese alumno en esa comisión
  const califsAll = await Calificacion.find({
    alumno: alumno._id,
    comision: alumno.comision,
  });

  if (!califsAll.length) {
    return { promedio: null, puedePromocionar: false };
  }

  // 3) Tomar solo el ÚLTIMO ciclo lectivo (coincide con el boletín actual)
  const maxCiclo = califsAll.reduce(
    (max, c) => (c.cicloLectivo > max ? c.cicloLectivo : max),
    califsAll[0].cicloLectivo
  );

  const califs = califsAll.filter((c) => c.cicloLectivo === maxCiclo);

  if (!califs.length) {
    return { promedio: null, puedePromocionar: false };
  }

  // 4) Inicializar estructura de notas por materia
  const notasPorMateria = new Map();

  materias.forEach((m) => {
    notasPorMateria.set(String(m._id), {
      1: null,
      2: null,
      3: null,
      diciembre: null,
      marzo: null,
      previa: null,
    });
  });

  // Cargar las notas correspondientes en la estructura
  califs.forEach((c) => {
    const mid = String(c.materia);
    if (!notasPorMateria.has(mid)) return;

    const notas = notasPorMateria.get(mid);
    switch (c.trimestre) {
      case 1:
      case 2:
      case 3:
        notas[c.trimestre] = c.nota;
        break;
      case 4:
        notas.diciembre = c.nota;
        break;
      case 5:
        notas.marzo = c.nota;
        break;
      case 6:
        notas.previa = c.nota;
        break;
      default:
        break;
    }
  });

  // Lógica interna: toma las notas de una materia y decide promedio y nota final
  function calcularEstadoFilaBackend(notas) {
    const t1 = typeof notas[1] === "number" ? notas[1] : null;
    const t2 = typeof notas[2] === "number" ? notas[2] : null;
    const t3 = typeof notas[3] === "number" ? notas[3] : null;
    const diciembre =
      typeof notas.diciembre === "number" ? notas.diciembre : null;
    const marzo = typeof notas.marzo === "number" ? notas.marzo : null;
    const previa = typeof notas.previa === "number" ? notas.previa : null;

    let promedio = null;

    // Promedio de trimestres solo si están cargados los 3
    if (t1 !== null && t2 !== null && t3 !== null) {
      promedio = (t1 + t2 + t3) / 3;
    }

    let notaFinal = null;

    if (promedio !== null && promedio >= 6) {
      notaFinal = promedio;
    } else if (diciembre !== null && diciembre >= 6) {
      notaFinal = diciembre;
    } else if (marzo !== null && marzo >= 6) {
      notaFinal = marzo;
    } else if (previa !== null && previa >= 6) {
      notaFinal = previa;
    } else {
      // Si ninguna está aprobada pero hay notas, uso la última instancia disponible
      if (previa !== null) notaFinal = previa;
      else if (marzo !== null) notaFinal = marzo;
      else if (diciembre !== null) notaFinal = diciembre;
      else if (promedio !== null) notaFinal = promedio;
      else notaFinal = null;
    }

    return { promedio, notaFinal };
  }

  // 5) Recorrer materias, sacar la nota final de cada una y ver si se puede promocionar
  const notasFinales = [];
  let faltaNotaFinalEnAlguna = false;

  materias.forEach((m) => {
    const notas = notasPorMateria.get(String(m._id)) || {
      1: null,
      2: null,
      3: null,
      diciembre: null,
      marzo: null,
      previa: null,
    };

    const { notaFinal } = calcularEstadoFilaBackend(notas);

    if (notaFinal === null) {
      faltaNotaFinalEnAlguna = true;
      return;
    }

    notasFinales.push(notaFinal);
  });

  if (faltaNotaFinalEnAlguna || notasFinales.length !== totalMaterias) {
    // No hay nota final en todas las materias
    return { promedio: null, puedePromocionar: false };
  }

  const suma = notasFinales.reduce((acc, n) => acc + n, 0);
  const promedio = suma / notasFinales.length;

  // Para poder promocionar: TODAS las notas finales tienen que ser >= 6
  const puedePromocionar = notasFinales.every((n) => n >= 6);

  return { promedio, puedePromocionar };
}