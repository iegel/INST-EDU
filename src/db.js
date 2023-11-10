import mongoose from 'mongoose'

export const connectDB = async() => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/merndb');
        console.log('DB is connected'); // Si la conexión salio ok
    } catch (error){
        console.log(error); // Si hubo un error
    }
}
