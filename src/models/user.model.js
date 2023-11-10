import mongoose from "mongoose"


//Esquema Usuario para el guardado
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        trim: true //limpia espacios al principio y final
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true //cada email es unico
    },
    password: {
        type: String,
        required: true,
    }
    
},
    {
        timestamps: true //Fecha de creacion y de actualización
    }
)

export default mongoose.model('User',userSchema) // Modelo necesario para poder interectura con la base de datos con los metodos

