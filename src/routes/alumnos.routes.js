import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno } from "../controllers/alumnos.controller.js";
import { createAlumnoSchema } from "../schemas/alumno.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
const router = Router()

router.get('/alumnos', authRequired, getAlumnos) // obtener todas
router.get('/alumnos/:id', authRequired,getAlumno) //obtener una
router.post('/alumnos', authRequired,validateSchema(createAlumnoSchema),createAlumno) // crear una
router.delete('/alumnos/:id', authRequired,deleteAlumno) //borrar una
router.put('/alumnos/:id', authRequired,updateAlumno) //updatear una


export default router