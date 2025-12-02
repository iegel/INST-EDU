import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getMaterias, getMateria, createMateria, updateMateria, deleteMateria } from "../controllers/materias.controller.js";
import { createMateriaSchema } from "../schemas/materia.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
const router = Router()

router.get('/materias', authRequired, getMaterias) // obtener todas
router.get('/materias/:id', authRequired,getMateria) //obtener una
router.post('/materias', authRequired,validateSchema(createMateriaSchema),createMateria) // crear una
router.delete('/materias/:id', authRequired,deleteMateria) //borrar una
router.put('/materias/:id', authRequired,updateMateria) //updatear una


export default router