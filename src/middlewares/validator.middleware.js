// Recibe un esquema (por ejemplo de Zod) y devuelve un middleware
export const validateSchema = (schema) => (req, res, next) => {
  try {
    // Validamos el cuerpo del request con el esquema
    schema.parse(req.body);
    next();
  } catch (error) {
    // Si hay errores de validación, devolvemos todos los mensajes
    return res
      .status(400)
      .json(error.errors.map((err) => err.message));
  }
};