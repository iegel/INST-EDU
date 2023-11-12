import mongoose from 'mongoose'

const materiaSchema = new mongoose.Schema({
    nombreMateria: {
        type: String,
        required: true
    },
    docente: {
        type: String,
        required: true
    },
    comision: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Materia',materiaSchema)
