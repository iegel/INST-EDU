import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Define los valores permitidos para el campo "role"
const validRoles = ['Admin', 'Preceptor'];

// Esquema Usuario para el guardado
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true // limpia espacios al principio y final
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
        enum: validRoles // solo permite los valores definidos en validRoles
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true // Fecha de creación y de actualización
    }
);

userSchema.method('checkPassword', async function checkPassword(potentialPassword) {
    if (!potentialPassword) {
        return Promise.reject(new Error('Password is required'));
    }

    const isMatch = await bcrypt.compare(potentialPassword, this.password);

    return { isOk: isMatch, isLocked: !this.isActive };
});

export default mongoose.model('User', userSchema);
