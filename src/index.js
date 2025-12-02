import app from './app.js';
import { connectDB } from './db.js';
import { PORT } from './config.js';

// Primero intento conectar a la base de datos.
// Si la conexión falla, no tiene sentido arrancar el servidor.
connectDB();

// Una vez conectada la base, levanto el servidor Express.
app.listen(PORT, () => {
  console.log('Server on port', PORT);
});