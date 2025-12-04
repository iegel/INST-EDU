import mongoose from "mongoose";

const materiaSchema = new mongoose.Schema(
  {
    // Nombre de la materia
    nombreMateria: { type: String, required: true, trim: true },

    // Nombre del docente
    docente: { type: String, required: true, trim: true },

    // Comisión a la que pertenece la materia
    comision: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

materiaSchema.index(
  { nombreMateria: 1, comision: 1 },
  { unique: true }
);

export default mongoose.model("Materia", materiaSchema);
