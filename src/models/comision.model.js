import mongoose from "mongoose";

const comisionSchema = new mongoose.Schema(
  {
    // Identificador legible del curso, por ejemplo "1A", "3B"
    numeroComision: {
      type: String,
      required: true,
      unique: true, // no puede haber dos comisiones con el mismo código
      trim: true,
    },
    // Año al que corresponde el curso (1º a 5º)
    anio: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // División o nombre del curso (A, B, etc.)
    curso: {
      type: String,
      required: true,
      trim: true,
    },
    // Referencia al usuario que es el preceptor del curso
    preceptor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Guarda automáticamente createdAt y updatedAt
    timestamps: true,
  }
);

export default mongoose.model("Comision", comisionSchema);