import mongoose from 'mongoose';
import Comision from '../models/comision.model.js'; // Asegúrate de poner la ruta correcta

const datosDeOrigen = [
    { _id: "1", preceptor: 'Nombre1' },
    { _id: "2", preceptor: 'Nombre2' },
    // ... Agrega más datos según sea necesario
];

mongoose.connect('mongodb://127.0.0.1/institutoeducativo', { useNewUrlParser: true, useUnifiedTopology: true });

// Utiliza async/await para manejar la promesa devuelta por insertMany
async function migrateData() {
    try {
        const result = await Comision.insertMany(datosDeOrigen);
        console.log('Datos migrados con éxito:', result);
    } catch (error) {
        console.error('Error al migrar datos:', error);
    } finally {
        mongoose.disconnect();
    }
}

migrateData();
