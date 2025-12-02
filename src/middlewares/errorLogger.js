import fs from 'fs';

export const errorLogger = (err, req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${
    err.message
  }\n`;

  fs.appendFile('errors.log', log, (fsErr) => {
    if (fsErr) {
      console.error('Failed to write error log:', fsErr);
    }
  });

  // Respuesta genérica de error
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Error interno del servidor' });
};