import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getBoletinAlumno,
  guardarBoletinAlumno,
  getHistorialBoletinAlumno,
} from "../controllers/calificaciones.controller.js";

const router = Router();

// Boletín del alumno para un ciclo lectivo puntual.
// Si no se pasa ?year y ?comision, el backend busca el "boletín actual".
router.get("/boletin/:alumnoId", authRequired, getBoletinAlumno);

// Guarda o actualiza el boletín de un ciclo lectivo para un alumno.
// Borra las notas previas de ese año y vuelve a insertar las nuevas.
router.post("/boletin/:alumnoId", authRequired, guardarBoletinAlumno);

// Devuelve el historial completo de boletines del alumno,
// agrupado por ciclo lectivo y comisión.
router.get(
  "/boletin/:alumnoId/historial",
  authRequired,
  getHistorialBoletinAlumno
);

export default router;
