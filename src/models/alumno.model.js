import mongoose from 'mongoose';

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
        type: String,
        required: true
    },
//    comision: {
//        type: mongoose.Schema.Types.ObjectId,
//        ref: 'Comision', // referencia al modelo Comision
//        required: true
//    }
    comision: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('Alumno', alumnoSchema);