import Comision from "../models/comision.model.js";
import User from "../models/user.model.js";

import Alumno from "../models/alumno.model.js";
import Materia from "../models/materia.model.js";
import Calificacion from "../models/calificacion.model.js";


// GET /api/comisiones
// Devuelvo la lista de todas las comisiones, incluyendo datos básicos del preceptor.
export const getComisiones = async (req, res) => {
  try {
    const comisiones = await Comision.find().populate(
      "preceptor",
      "username email isActive role"
    );
    return res.json(comisiones);
  } catch (error) {
    console.error("Error al obtener comisiones:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener la lista de cursos" });
  }
};

// GET /api/comisiones/:id
// Devuelvo una comisión puntual, también con la info del preceptor.
export const getComision = async (req, res) => {
  try {
    const { id } = req.params;
    const comision = await Comision.findById(id).populate(
      "preceptor",
      "username email isActive role"
    );

    if (!comision) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(comision);
  } catch (error) {
    console.error("Error al obtener curso:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el curso" });
  }
};

// POST /api/comisiones
// Crea una comisión nueva y asocia un preceptor existente.
export const createComision = async (req, res) => {
  try {

    // Usuario autenticado
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res.status(403).json({
        message: "Solo un administrador puede crear cursos",
      });
    }

    const { numeroComision, anio, curso, preceptor } = req.body;

    // Validamos que el preceptor exista en la colección de usuarios
    const preceptorUser = await User.findById(preceptor);
    if (!preceptorUser) {
      return res.status(400).json({ message: "Preceptor inválido" });
    }

    const nueva = new Comision({
      numeroComision,
      anio,
      curso,
      preceptor: preceptorUser._id,
    });

    const saved = await nueva.save();

    // Volvemos a buscarla con populate para devolver también los datos del preceptor
    const populated = await saved.populate("preceptor", "username email");

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Error al crear curso:", error);
    return res
      .status(500)
      .json({ message: "Error al crear el curso" });
  }
};

// PUT /api/comisiones/:id
export const updateComision = async (req, res) => {
  try {

    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res.status(403).json({
        message: "Solo un administrador puede editar cursos",
      });
    }

    const { id } = req.params;
    const { numeroComision, anio, curso, preceptor } = req.body;

    // Traigo la comisión actual para comparar antes de actualizar
    const comisionActual = await Comision.findById(id);
    if (!comisionActual) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    const updateData = { numeroComision, anio, curso };

    // Si me mandan un preceptor nuevo, valido que exista
    if (preceptor) {
      const preceptorUser = await User.findById(preceptor);
      if (!preceptorUser) {
        return res.status(400).json({ message: "Preceptor inválido" });
      }
      updateData.preceptor = preceptorUser._id;
    }

    // Si el número de comisión cambia, tengo que validar que no esté en uso
    const numeroCambió =
      numeroComision && numeroComision !== comisionActual.numeroComision;

    if (numeroCambió) {
      const numeroViejo = comisionActual.numeroComision;

      // Reviso si hay datos usando la comisión actual
      const tieneAlumnos = await Alumno.exists({ comision: numeroViejo });
      const tieneMaterias = await Materia.exists({ comision: numeroViejo });
      const tieneCalificaciones = await Calificacion.exists({
        comision: numeroViejo,
      });

      if (tieneAlumnos || tieneMaterias || tieneCalificaciones) {
        // Si la comisión ya está en uso, no permito cambiar el número (1A, 2B, etc.)
        return res.status(400).json({
          message:
            "No se puede cambiar el curso porque ya tiene alumnos, materias o boletines asociados. Primero hay que reasignar esos datos.",
        });
      }
    }

    // Si pasó las validaciones, actualizo
    const updated = await Comision.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("preceptor", "username email");

    return res.json(updated);
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    return res
      .status(500)
      .json({ message: "Error al actualizar el curso" });
  }
};



// DELETE /api/comisiones/:id
export const deleteComision = async (req, res) => {
  try {


    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res.status(403).json({
        message: "Solo un administrador puede borrar cursos",
      });
    }

    const { id } = req.params;

    // Primero busco la comisión por ID
    const comision = await Comision.findById(id);
    if (!comision) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Guardo el número de comisión (ej: "1A")
    const numero = comision.numeroComision;

    // Verifico si hay alumnos, materias o calificaciones que apunten a esta comisión
    const tieneAlumnos = await Alumno.exists({ comision: numero });
    const tieneMaterias = await Materia.exists({ comision: numero });
    const tieneCalificaciones = await Calificacion.exists({ comision: numero });

    if (tieneAlumnos || tieneMaterias || tieneCalificaciones) {
      // Regla de negocio:
      // si la comisión ya tiene info asociada, no la dejo borrar
      return res.status(400).json({
        message:
          "No se puede borrar el curso porque tiene alumnos, materias o boletines asociados.",
      });
    }

    // Si no tiene nada asociado, la borro normalmente
    await Comision.findByIdAndDelete(id);

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar el curso" });
  }
};