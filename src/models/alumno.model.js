// models/alumno.model.js
import mongoose from 'mongoose';

const alumnoSchema = new mongoose.Schema(
  {
    // Nombre del alumno
    nombre: { type: String, required: true },

    // Apellido del alumno
    apellido: { type: String, required: true },

    // DNI como string para evitar problemas de formato
    dni: { type: String, required: true },

    // Comisión a la que pertenece (ej: "1A", "3B")
    comision: { type: String, required: true },

    // Indica si el alumno ya egresó
    egresado: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Guarda automáticamente createdAt y updatedAt
    timestamps: true,
  }
);


export default mongoose.model('Alumno', alumnoSchema);
