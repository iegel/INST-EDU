import { Router } from "express";
import {login,register,logout,profile, verifyToken, getUsers,getUserById,updateUser,deleteUser} from "../controllers/auth.controller.js";
import  { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js"; 
import { registerSchema,loginSchema } from "../schemas/auth.schema.js";
const router = Router()

// Registro de usuario nuevo.
// Antes de llegar al controlador, se valida el cuerpo del request con Zod.
router.post("/register", validateSchema(registerSchema), register);

// Login del usuario.
// También se valida primero el formato de email y password.
router.post("/login", validateSchema(loginSchema), login);

// Cierra la sesión borrando la cookie con el token.
router.post("/logout", logout);

// Verifica si el token actual sigue siendo válido.
// Se usa, por ejemplo, para mantener la sesión en el frontend.
router.get("/verify", verifyToken);

// Devuelve los datos del usuario logueado.
// Esta ruta está protegida: necesita un token válido.
router.get("/profile", authRequired, profile);

// CRUD de usuarios. Solo accesible si el usuario tiene rol Admin.
router.get("/users", authRequired, getUsers);
router.get("/users/:id", authRequired, getUserById);
router.put("/users/:id", authRequired, updateUser);
router.delete("/users/:id", authRequired, deleteUser);

export default router