import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';

// Función que se encarga de conectar con MongoDB mediante Mongoose.
export const connectDB = async () => {
  try {
    // Intento establecer la conexión usando la URI definida en config.js
    await mongoose.connect(MONGO_URI);
    console.log('DB is connected');
  } catch (error) {
    // Si la conexión falla, muestro el error para poder depurarlo
    console.error('DB connection error:', error);
  }
};