import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js';

// Middleware para proteger rutas.
// Verifica que exista un token y que sea válido.
export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  // Si no hay token, no está autenticado
  if (!token)
    return res.status(401).json({ message: "No token, no autorizado" });

  // Verificamos el token con la clave secreta
  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Guardamos los datos del usuario en la request para usarlos en la ruta
    req.user = user;
    next();
  });
};