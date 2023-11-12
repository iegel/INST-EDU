import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getComisiones, getComision, createComision, updateComision, deleteComision } from "../controllers/comisiones.controller.js";
import { createComisionSchema } from "../schemas/comision.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
const router = Router()

router.get('/comisiones', authRequired, getComisiones) // obtener todas
router.get('/comisiones/:id', authRequired,getComision) //obtener una
router.post('/comisiones', authRequired,validateSchema(createComisionSchema),createComision) // crear una
router.delete('/comisiones/:id', authRequired,deleteComision) //borrar una
router.put('/comisiones/:id', authRequired,updateComision) //updatear una


export default router