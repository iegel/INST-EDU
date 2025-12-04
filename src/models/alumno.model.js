import mongoose from "mongoose";

const alumnoSchema = new mongoose.Schema(
  {
    // Nombre del alumno
    nombre: { type: String, required: true, trim: true },

    // Apellido del alumno
    apellido: { type: String, required: true, trim: true },

    // DNI ÚNICO 
    dni: { type: String, required: true, unique: true, trim: true },

    // Comisión actual
    comision: { type: String, required: true, trim: true },

    // Si el alumno terminó 5° año → pasa a egresado
    egresado: { type: Boolean, default: false },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt
  }
);

export default mongoose.model("Alumno", alumnoSchema);
