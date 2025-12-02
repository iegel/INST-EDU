import mongoose from "mongoose";

const calificacionSchema = new mongoose.Schema(
  {
    // Referencia al alumno al que pertenece la nota
    alumno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumno",
      required: true,
    },
    // Materia a la que corresponde esta calificación
    materia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materia",
      required: true,
    },
    // 1,2,3 = trimestres, 4 = diciembre, 5 = marzo, 6 = previa
    trimestre: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    // Nota numérica de 1 a 10
    nota: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    // Texto libre opcional para observaciones del docente
    observaciones: {
      type: String,
      default: "",
    },
    // Año del ciclo lectivo (ej: 2025)
    cicloLectivo: {
      type: Number,
      required: true,
    },
    // Curso del alumno en ese año (ej: "1A", "3B")
    comision: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Evita duplicar notas para la misma materia en el mismo trimestre y año.
// Un alumno solo puede tener una calificación por materia+trimestre+ciclo.
calificacionSchema.index(
  { alumno: 1, materia: 1, trimestre: 1, cicloLectivo: 1 },
  { unique: true }
);

export default mongoose.model("Calificacion", calificacionSchema);