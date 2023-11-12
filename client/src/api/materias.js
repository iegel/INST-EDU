import axios from './axios'
 
export const getMateriasRequest = () => axios.get('/materias')
export const getMateriaRequest = (id) => axios.get(`/materias/${id}`)
export const createMateriasRequest = (materia) => axios.post('/materias',materia)
export const updateMateriasRequest = (id,materia) => axios.put(`/materias/${id}`,materia);
export const deleteMateriasRequest = (id) => axios.delete(`/materias/${id}`)
