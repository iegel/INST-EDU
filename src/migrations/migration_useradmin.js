import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'; // Asegúrate de importar tu modelo de usuario

// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1/institutoeducativo', { useNewUrlParser: true, useUnifiedTopology: true });

// Función para realizar la migración inicial
const migrateInitialUser = async () => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'admin@admin.com.ar' });
    if (existingUser) {
      console.log('El usuario ya existe, no es necesario migrar.');
      return;
    }

    // Crear un nuevo usuario
    const newUser = new User({
      username: 'admin',
      email: 'admin@admin.com.ar',
      password: await bcrypt.hash('123456', 10), // Hash de la contraseña
      isActive: true,
      role: "Admin"
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    console.log('Migración inicial completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración inicial:', error);
  } finally {
    // Cerrar la conexión a la base de datos después de la migración
    mongoose.connection.close();
  }
};

// Ejecutar la migración
migrateInitialUser();