import axios from "./axios"

// Registro de usuario (POST /register)
export const registerRequest = (user) => axios.post(`/register`, user)

// Login de usuario (POST /login)
// El backend setea la cookie del token
export const loginRequest = (user) => axios.post(`/login`, user)

// Verifica token del usuario logueado (GET /verify)
export const verifyTokenRequest = () => axios.get("/verify")

// CRUD de usuarios (solo Admin)
export const getUsersRequest = () => axios.get("/users")
export const getUserRequest = (id) => axios.get(`/users/${id}`)
export const updateUserRequest = (id, data) =>
  axios.put(`/users/${id}`, data)
export const deleteUserRequest = (id) => axios.delete(`/users/${id}`)
