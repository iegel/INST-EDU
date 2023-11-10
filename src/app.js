import express from 'express'
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'
import alumnoRoutes from './routes/alumnos.routes.js'
import cors from 'cors'

const app = express() // servidor

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev')); //para ver la peticiones que llegan al back end
app.use(express.json());
app.use(cookieParser());

app.use("/api",authRoutes); //todas las rutas van a comenzar con /api
app.use("/api",alumnoRoutes); //todas las rutas van a comenzar con /api


//app.listen(3000) // escucha en el puerto 3000
//console.log('Server on port',3000)

export default app; // exporta la app