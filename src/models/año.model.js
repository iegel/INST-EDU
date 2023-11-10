import mongoose from 'mongoose'

const añoSchema = new mongoose.Schema({
    año:{
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export default mongoose.model('Año',añoSchema)
