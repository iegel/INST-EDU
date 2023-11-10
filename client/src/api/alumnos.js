import axios from './axios'
 
export const getAlumnosRequest = () => axios.get('/alumnos')
export const getAlumnoRequest = (id) => axios.get(`/alumnos/${id}`)
export const createAlumnosRequest = (alumno) => axios.post('/alumnos',alumno)
export const updateAlumnosRequest = (id,alumno) => axios.put(`/alumnos/${id}`,alumno);
export const deleteAlumnosRequest = (id) => axios.delete(`/alumnos/${id}`)
