import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Roles permitidos en el sistema
const validRoles = ["Admin", "Preceptor"];

// Esquema de Usuario para autenticación y permisos
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // un mismo mail no se puede repetir
    },
    password: {
      type: String,
      required: true,
      select: false, // por defecto no trae el password en las consultas
    },
    role: {
      type: String,
      required: true,
      enum: validRoles, // solo Admin o Preceptor
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Método de instancia para verificar contraseña y estado del usuario
userSchema.method(
  "checkPassword",
  async function checkPassword(potentialPassword) {
    if (!potentialPassword) {
      return Promise.reject(new Error("Password is required"));
    }

    // Comparamos la contraseña en texto plano con el hash guardado
    const isMatch = await bcrypt.compare(potentialPassword, this.password);

    // isOk indica si la contraseña coincide
    // isLocked indica si el usuario está inactivo/bloqueado
    return { isOk: isMatch, isLocked: !this.isActive };
  }
);

export default mongoose.model("User", userSchema);
