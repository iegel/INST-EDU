import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Rutas principales del proyecto
import authRoutes from './routes/auth.routes.js';
import alumnoRoutes from './routes/alumnos.routes.js';
import materiaRoutes from './routes/materias.routes.js';
import comisionRoutes from './routes/comisiones.routes.js';
import calificacionesRoutes from './routes/calificaciones.routes.js';

// Middleware propio para registrar errores
import { errorLogger } from './middlewares/errorLogger.js';

const app = express();

// Configuración de CORS.
// Permito las solicitudes del frontend (Vite) y el envío de cookies.
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Morgan muestra en consola cada request que llega al backend (GET, POST, etc.)
app.use(morgan('dev'));

// Habilita que Express pueda entender JSON en el body de las peticiones.
app.use(express.json());

// Permite leer cookies enviadas desde el frontend.
app.use(cookieParser());

// Registro de todas las rutas bajo el prefijo "/api"
app.use('/api', authRoutes);
app.use('/api', alumnoRoutes);
app.use('/api', materiaRoutes);
app.use('/api', comisionRoutes);
app.use('/api', calificacionesRoutes);

// Middleware para loguear errores (centraliza errores en un solo lugar)
app.use(errorLogger);

export default app;
