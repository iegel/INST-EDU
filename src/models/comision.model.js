import mongoose from 'mongoose'

const comisionSchema = new mongoose.Schema({
    numeroComision: {
        type: Number,
        required: true
    },
    preceptor: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Comision',comisionSchema)
