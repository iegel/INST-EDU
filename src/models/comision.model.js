import mongoose from 'mongoose';
const comisionSchema = new mongoose.Schema({
    numeroComision: {
        type: String, // Numero de comision
        required: true,
        unique: true
      },
    preceptor: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Comision', comisionSchema);