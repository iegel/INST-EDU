import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Alumno from '../models/alumno.model.js';
import Materia from '../models/materia.model.js';
import Comision from '../models/comision.model.js';

// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1/institutoeducativo', { useNewUrlParser: true, useUnifiedTopology: true });

// Función para realizar las cuatro migraciones
const realizarMigraciones = async () => {
  try {
    // Migración de usuarios
    await migrarUsuarios();

    // Migración de alumnos
    await migrarAlumnos();

    // Migración de materias
    await migrarMaterias();

    // Migración de comisiones
    await migrarComisiones();

    console.log('Todas las migraciones completadas con éxito.');
  } catch (error) {
    console.error('Error durante las migraciones:', error);
  } finally {
    // Cerrar la conexión a la base de datos después de las migraciones
    mongoose.connection.close();
  }
};

// Función para migrar usuarios
const migrarUsuarios = async () => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'admin@admin.com.ar' });

    // Si el usuario existe, eliminarlo
    if (existingUser) {
      await User.deleteOne({ email: 'admin@admin.com.ar' });
      console.log('Usuario existente eliminado.');
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

    console.log('Migración de usuarios completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración de usuarios:', error);
  }
};

// Función para migrar alumnos
const migrarAlumnos = async () => {
  try {
    // Verificar si los alumnos ya existen
    const existingAlumno1 = await Alumno.findOne({ dni: '38201170' });
    const existingAlumno2 = await Alumno.findOne({ dni: '38201171' });

    // Si el primer alumno existe, eliminarlo
    if (existingAlumno1) {
      await Alumno.deleteOne({ dni: '38201170' });
      console.log('Primer alumno existente eliminado.');
    }

    // Si el segundo alumno existe, eliminarlo
    if (existingAlumno2) {
      await Alumno.deleteOne({ dni: '38201171' });
      console.log('Segundo alumno existente eliminado.');
    }

    // Dar de alta el primer alumno
    const nuevoAlumno1 = new Alumno({
      nombre: 'Ignacio',
      apellido: 'Egel',
      dni: '38201170',
      comision: '1'
    });
    await nuevoAlumno1.save();
    console.log('Primer alumno dado de alta.');

    // Dar de alta el segundo alumno
    const nuevoAlumno2 = new Alumno({
      nombre: 'Raul',
      apellido: 'Gonzalez',
      dni: '38201171',
      comision: '2'
    });
    await nuevoAlumno2.save();
    console.log('Segundo alumno dado de alta.');

    console.log('Migración de alumnos completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración de alumnos:', error);
  }
};

// Función para migrar materias
const migrarMaterias = async () => {
  try {
    // Verificar si las materias ya existen
    const existingMateria1 = await Materia.findOne({ nombreMateria: 'Matematica' });
    const existingMateria2 = await Materia.findOne({ nombreMateria: 'Lengua' });

    // Si la primera materia existe, eliminarla
    if (existingMateria1) {
      await Materia.deleteOne({ nombreMateria: 'Matematica' });
      console.log('Primera materia existente eliminada.');
    }

    // Si la segunda materia existe, eliminarla
    if (existingMateria2) {
      await Materia.deleteOne({ nombreMateria: 'Lengua' });
      console.log('Segunda materia existente eliminada.');
    }

    // Dar de alta la primera materia
    const nuevaMateria1 = new Materia({
      nombreMateria: 'Matematica',
      docente: 'Lucas Perez',
      comision: '1'
    });
    await nuevaMateria1.save();
    console.log('Primera materia dada de alta.');

    // Dar de alta la segunda materia
    const nuevaMateria2 = new Materia({
      nombreMateria: 'Lengua',
      docente: 'Silvina Lopez',
      comision: '1'
    });
    await nuevaMateria2.save();
    console.log('Segunda materia dada de alta.');

    console.log('Migración de materias completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración de materias:', error);
  }
};

// Función para migrar comisiones
const migrarComisiones = async () => {
  try {
    // Verificar si las comisiones ya existen
    const existingComision1 = await Comision.findOne({ numeroComision: '1' });
    const existingComision2 = await Comision.findOne({ numeroComision: '2' });

    // Si la primera comisión existe, eliminarla
    if (existingComision1) {
      await Comision.deleteOne({ numeroComision: '1' });
      console.log('Primera comisión existente eliminada.');
    }

    // Si la segunda comisión existe, eliminarla
    if (existingComision2) {
      await Comision.deleteOne({ numeroComision: '2' });
      console.log('Segunda comisión existente eliminada.');
    }

    // Dar de alta la primera comisión
    const nuevaComision1 = new Comision({
      numeroComision: '1',
      preceptor: 'Hernan Rodriguez'
    });
    await nuevaComision1.save();
    console.log('Primera comisión dada de alta.');

    // Dar de alta la segunda comisión
    const nuevaComision2 = new Comision({
      numeroComision: '2',
      preceptor: 'Pablo Fernandez'
    });
    await nuevaComision2.save();
    console.log('Segunda comisión dada de alta.');

    console.log('Migración de comisiones completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración de comisiones:', error);
  }
};

// Ejecutar la función para realizar todas las migraciones
realizarMigraciones();