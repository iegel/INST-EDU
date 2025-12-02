import axios from './axios'

// Trae todos los alumnos (GET /alumnos)
export const getAlumnosRequest = () => axios.get('/alumnos')

// Trae un alumno puntual por ID (GET /alumnos/:id)
export const getAlumnoRequest = (id) => axios.get(`/alumnos/${id}`)

// Crea un alumno nuevo (POST /alumnos)
export const createAlumnosRequest = (alumno) => axios.post('/alumnos', alumno)

// Edita un alumno existente (PUT /alumnos/:id)
export const updateAlumnosRequest = (id, alumno) =>
  axios.put(`/alumnos/${id}`, alumno)

// Elimina un alumno (DELETE /alumnos/:id)
export const deleteAlumnosRequest = (id) =>
  axios.delete(`/alumnos/${id}`)

// Promoción masiva de alumnos (POST /alumnos/promocionar)
export const promoteAlumnosRequest = (ids) =>
  axios.post("/alumnos/promocionar", { ids })
