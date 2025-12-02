import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno,promoteAlumnos } from "../controllers/alumnos.controller.js";
import { createAlumnoSchema } from "../schemas/alumno.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
const router = Router()

// Lista de alumnos.
// Si el usuario es Preceptor, solo ve sus propios alumnos.
// Si es Admin, ve todos.
router.get("/alumnos", authRequired, getAlumnos);

// Devuelve un alumno por id.
// Si es Preceptor, también se controla que el alumno sea de sus cursos.
router.get("/alumnos/:id", authRequired, getAlumno);

// Crea un alumno nuevo.
// Valido el body con Zod antes de llegar al controlador.
router.post(
  "/alumnos",
  authRequired,
  validateSchema(createAlumnoSchema),
  createAlumno
);

// Borra un alumno por id.
router.delete("/alumnos/:id", authRequired, deleteAlumno);

// Actualiza los datos de un alumno existente.
router.put("/alumnos/:id", authRequired, updateAlumno);

// Promociona un conjunto de alumnos a la comisión siguiente o los marca como egresados.
router.post("/alumnos/promocionar", authRequired, promoteAlumnos);

export default router;