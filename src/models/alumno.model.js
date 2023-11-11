import mongoose from 'mongoose'

const alumnoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                // Verifica que sea un número entero y tenga 8 dígitos
                return Number.isInteger(value) && value.toString().length === 8;
            },
            message: 'El DNI debe ser un número entero de 8 dígitos'
        }
    },
    comision: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comision',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Alumno',alumnoSchema)
