import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getComisiones, getComision, createComision, updateComision, deleteComision } from "../controllers/comisiones.controller.js";
import { createComisionSchema } from "../schemas/comision.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
const router = Router();

// Devuelve todas las comisiones (cursos)
router.get("/comisiones", authRequired, getComisiones);

// Devuelve una comisión puntual por id
router.get("/comisiones/:id", authRequired, getComision);

// Crea una comisión nueva, validando los datos con un esquema
router.post(
  "/comisiones",
  authRequired,
  validateSchema(createComisionSchema),
  createComision
);

// Elimina una comisión por id
router.delete("/comisiones/:id", authRequired, deleteComision);

// Actualiza los datos de una comisión existente
router.put("/comisiones/:id", authRequired, updateComision);

export default router;