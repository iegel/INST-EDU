import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import {createAccesToken} from '../libs/jwt.js'
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js'
import Comision from '../models/comision.model.js';

// Registro de usuario nuevo
export const register = async (req, res) => {
  try {
    const { username, email, password, role, isActive } = req.body;
    // En este punto el body ya pasó por el esquema de Zod (validaciones básicas)

    // Hasheamos la contraseña antes de guardarla
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      // Si no viene rol, por defecto lo dejamos como "Preceptor"
      role: role || "Preceptor",
      // Si no mandan isActive, asumimos que el usuario está activo
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    await newUser.save();

    // No devolvemos la contraseña al frontend
    return res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
    });
  } catch (error) {
    console.error("Error en register:", error);

    // Error típico de Mongo si el email ya existe (índice único)
    if (error.code === 11000) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    return res
      .status(500)
      .json({ message: "Error al registrar el usuario" });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;
  // Acá ya vienen validados email y password desde el middleware de Zod

  try {
    // Buscamos el usuario por email e incluimos el campo password (que suele estar oculto)
    const userFound = await User.findOne({ email }, "+password");
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // checkPassword es un método del modelo que compara la contraseña
    // y además controla si el usuario está bloqueado.
    const result = await userFound.checkPassword(password);

    if (result.isLocked) {
      console.error("Usuario bloqueado");
      return res.status(400).end();
    }

    if (!result.isOk) {
      console.error("Contraseña inválida");
      return res.status(401).end();
    }

    // Si la contraseña es correcta, generamos un token JWT
    const token = await createAccesToken({ id: userFound._id });

    // Guardamos el token en una cookie para que el frontend pueda enviarlo en cada request
    res.cookie("token", token);

    // Respondemos con los datos básicos del usuario logueado
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cierra sesión limpiando la cookie del token
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

// Devuelve la información del usuario autenticado
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    role: userFound.role,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

// Verifica si el token actual es válido y devuelve los datos del usuario
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Verificamos el token con la clave secreta
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  });
};

// Listar todos los usuarios (solo Admin)
export const getUsers = async (req, res) => {
  try {
    // Usuario que hace la petición (lo obtenemos desde el token)
    const currentUser = await User.findById(req.user.id);

    if (!currentUser || currentUser.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Solo Admin puede ver usuarios." });
    }

    // Listamos todos los usuarios ocultando el campo password
    const users = await User.find({}, "-password");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por id (solo Admin)
export const getUserById = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Solo Admin puede ver usuarios." });
    }

    const user = await User.findById(req.params.id, "-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

// Actualizar usuario (solo Admin)
export const updateUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Solo Admin puede editar usuarios." });
    }

    const { username, email, role, isActive, password } = req.body;

    const updateData = {
      username,
      email,
      role,
      isActive,
    };

    // Si viene una contraseña nueva, la guardamos hasheada
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // devuelve el usuario ya actualizado
      runValidators: true,
      select: "-password",
    });

    if (!updated)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(updated);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

// Borrar usuario (solo Admin)
export const deleteUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res.status(403).json({
        message: "Acceso denegado. Solo Admin puede borrar usuarios.",
      });
    }

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Opcional: evitar que el admin se borre a sí mismo
    if (currentUser._id.toString() === userToDelete._id.toString()) {
      return res
        .status(400)
        .json({ message: "No podés borrar tu propio usuario." });
    }

    // Si es PRECEPTOR, verificamos si tiene cursos/comisiones asignadas
    const esPreceptor = userToDelete.role === "Preceptor";
    if (esPreceptor) {
      const tieneCursos = await Comision.findOne({
        preceptor: userToDelete._id,
      });

      if (tieneCursos) {
        return res.status(400).json({
          message:
            "No se puede borrar el preceptor porque tiene cursos asignados. Cambiá el preceptor de esos cursos antes de borrarlo.",
        });
      }
    }

    await User.findByIdAndDelete(userToDelete._id);
    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al borrar el usuario" });
  }
};