import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Roles permitidos en el sistema
const validRoles = ["Admin", "Preceptor"];

// Esquema de Usuario para autenticación y permisos
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true // cada usuario es único
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true // cada email es único
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: validRoles
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });


// Método de instancia para verificar contraseña y estado del usuario
userSchema.method(
  "checkPassword",
  async function checkPassword(potentialPassword) {
    if (!potentialPassword) {
      return Promise.reject(new Error("Password is required"));
    }

    // Comparo la contraseña en texto plano con el hash guardado
    const isMatch = await bcrypt.compare(potentialPassword, this.password);

    // isOk indica si la contraseña coincide
    // isLocked indica si el usuario está inactivo/bloqueado
    return { isOk: isMatch, isLocked: !this.isActive };
  }
);

export default mongoose.model("User", userSchema);
