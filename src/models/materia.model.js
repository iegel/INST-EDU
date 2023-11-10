import mongoose from 'mongoose'

const materiaSchema = new mongoose.Schema({
    materia:{
        type: String,
        required: true
    },
    profesor:{
        type: String,
        required:true
    },
    horas:{
        type: String,
        required:true
    },
    año:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Año', // Con esta linea y con la de arriba indico que hace referencia a otro modelo
        required : true
    }
},
{
    timestamps: true
});

export default mongoose.model('Materia',materiaSchema)
