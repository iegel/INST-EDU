import axios from './axios'

// Lista de materias (GET /materias)
export const getMateriasRequest = () => axios.get('/materias')

// Materia puntual (GET /materias/:id)
export const getMateriaRequest = (id) =>
  axios.get(`/materias/${id}`)

// Crear materia (POST /materias)
export const createMateriasRequest = (materia) =>
  axios.post('/materias', materia)

// Editar materia (PUT /materias/:id)
export const updateMateriasRequest = (id, materia) =>
  axios.put(`/materias/${id}`, materia)

// Borrar materia (DELETE /materias/:id)
export const deleteMateriasRequest = (id) =>
  axios.delete(`/materias/${id}`)
