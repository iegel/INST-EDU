import mongoose from "mongoose";
import Calificacion from "../models/calificacion.model.js";
import Alumno from "../models/alumno.model.js";
import Materia from "../models/materia.model.js";
import User from "../models/user.model.js";
import Comision from "../models/comision.model.js";

// GET /api/boletin/:alumnoId?year=2025&comision=1A
// Devuelve el boletín de un alumno para un ciclo lectivo y comisión.
// Si no se pasan parámetros, devuelve el "boletín actual" de su comisión actual.
export const getBoletinAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const yearQuery = req.query.year ? Number(req.query.year) : null;
    const comisionQuery = req.query.comision || null;

    // Usuario logueado (viene del token)
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verificamos que el alumno exista
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // 🔐 Si es Preceptor, validamos que el alumno sea de alguna de sus comisiones
    if (user.role === "Preceptor") {
      const comisionesPreceptor = await Comision.find({
        preceptor: user._id,
      });
      const cursos = comisionesPreceptor.map((c) => c.numeroComision);

      if (!cursos.includes(alumno.comision)) {
        return res.status(403).json({
          message: "No tiene permiso para ver el boletín de este alumno",
        });
      }
    }

    // --------------------------
    // Cálculo de ciclos disponibles y boletín actual
    // --------------------------

    // Buscamos todos los ciclos lectivos y comisiones donde el alumno tiene notas
    const ciclosRaw = await Calificacion.aggregate([
      {
        $match: {
          alumno: new mongoose.Types.ObjectId(alumnoId),
        },
      },
      {
        $group: {
          _id: { cicloLectivo: "$cicloLectivo", comision: "$comision" },
        },
      },
      { $sort: { "_id.cicloLectivo": -1 } },
    ]);

    const ciclosDisponibles = ciclosRaw
      .filter(
        (c) => c._id.cicloLectivo != null && c._id.comision != null
      )
      .map((c) => ({
        cicloLectivo: c._id.cicloLectivo,
        comision: c._id.comision,
      }));

    let cicloSeleccionado = null;
    let comisionSeleccionada = null;

    if (yearQuery && comisionQuery) {
      // Si el frontend pide un boletín concreto (año + comisión)
      cicloSeleccionado = yearQuery;
      comisionSeleccionada = comisionQuery;
    } else {
      // MODO "BOLETÍN ACTUAL":
      // Busco todos los ciclos de la comisión actual del alumno
      const ciclosDeComisionActual = ciclosDisponibles.filter(
        (c) => c.comision === alumno.comision
      );

      if (ciclosDeComisionActual.length > 0) {
        // Tomo el ciclo más reciente
        const maxYear = Math.max(
          ...ciclosDeComisionActual.map((c) => c.cicloLectivo)
        );
        cicloSeleccionado = maxYear;
        comisionSeleccionada = alumno.comision;
      } else {
        // No hay boletines cargados aún en esa comisión
        cicloSeleccionado = null;
        comisionSeleccionada = alumno.comision;
      }
    }

    // Traemos las materias de la comisión seleccionada
    const materias = await Materia.find({
      comision: comisionSeleccionada,
    });

    let calificaciones = [];
    if (cicloSeleccionado !== null) {
      // Traemos las calificaciones del alumno para ese ciclo+comisión
      calificaciones = await Calificacion.find({
        alumno: alumnoId,
        cicloLectivo: cicloSeleccionado,
        comision: comisionSeleccionada,
      }).populate("materia");
    }

    return res.json({
      alumno,
      materias,
      calificaciones,
      cicloLectivo: cicloSeleccionado,
      comision: comisionSeleccionada,
      ciclosDisponibles,
    });
  } catch (error) {
    console.error("Error al obtener boletín:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el boletín del alumno" });
  }
};

// POST /api/boletin/:alumnoId
// Guarda el boletín completo de un ciclo lectivo para un alumno.
// Primero borra las notas previas de ese año y luego inserta todas las nuevas.
export const guardarBoletinAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const { cicloLectivo, calificaciones, comision: comisionBody } = req.body;

    if (!cicloLectivo) {
      return res
        .status(400)
        .json({ message: "El ciclo lectivo es obligatorio" });
    }

    if (!Array.isArray(calificaciones)) {
      return res
        .status(400)
        .json({ message: "Las calificaciones deben venir en un array" });
    }

    // Usuario logueado
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // 🔐 Si es Preceptor → solo puede modificar boletines de sus alumnos
    if (user.role === "Preceptor") {
      const comisionesPreceptor = await Comision.find({
        preceptor: user._id,
      });
      const cursos = comisionesPreceptor.map((c) => c.numeroComision);

      if (!cursos.includes(alumno.comision)) {
        return res.status(403).json({
          message:
            "No tiene permiso para modificar el boletín de este alumno",
        });
      }
    }

    // 🚫 Restricción: un alumno egresado no puede recibir nuevos boletines
    if (alumno.egresado) {
      return res.status(400).json({
        message:
          "El alumno está egresado. Solo se pueden consultar boletines anteriores.",
      });
    }

    // Comisión a usar para el boletín: la que viene en el body o la comisión actual del alumno
    const comisionBoletin = comisionBody || alumno.comision;

    // Primero borramos las calificaciones previas de ese ciclo+comisión
    await Calificacion.deleteMany({
      alumno: alumnoId,
      cicloLectivo,
      comision: comisionBoletin,
    });

    // Preparamos los documentos a insertar
    const docs = calificaciones.map((c) => ({
      alumno: alumnoId,
      materia: c.materiaId,
      trimestre: c.trimestre,
      nota: c.nota,
      observaciones: c.observaciones || "",
      cicloLectivo,
      comision: comisionBoletin,
    }));

    const inserted = await Calificacion.insertMany(docs);

    return res.json({
      message: "Boletín guardado correctamente",
      insertedCount: inserted.length,
    });
  } catch (error) {
    console.error("Error al guardar boletín:", error);
    return res
      .status(500)
      .json({ message: "Error al guardar el boletín del alumno" });
  }
};

// GET /api/boletin/:alumnoId/historial
// Devuelve todas las calificaciones del alumno agrupadas por ciclo lectivo y comisión.
export const getHistorialBoletinAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;

    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Traemos todas las calificaciones del alumno, ordenadas por año y trimestre
    const calificaciones = await Calificacion.find({
      alumno: alumnoId,
    })
      .populate("materia")
      .sort({ cicloLectivo: -1, trimestre: 1 });

    const historial = [];

    // Agrupamos por cicloLectivo + comision
    for (const cal of calificaciones) {
      const ciclo = cal.cicloLectivo || "Sin ciclo";
      const comision = cal.comision || "Sin comisión";

      let grupo = historial.find(
        (h) => h.cicloLectivo === ciclo && h.comision === comision
      );

      if (!grupo) {
        grupo = {
          cicloLectivo: ciclo,
          comision,
          calificaciones: [],
        };
        historial.push(grupo);
      }

      grupo.calificaciones.push(cal);
    }

    return res.json({
      alumno,
      historial,
    });
  } catch (error) {
    console.error("Error al obtener historial de boletines:", error);
    return res.status(500).json({
      message: "Error al obtener el historial de boletines del alumno",
    });
  }
};