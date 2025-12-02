import axios from './axios'

// Lista de cursos (GET /comisiones)
export const getComisionesRequest = () => axios.get('/comisiones')

// Trae comisión puntual (GET /comisiones/:id)
export const getComisionRequest = (id) =>
  axios.get(`/comisiones/${id}`)

// Crea comisión (POST /comisiones)
export const createComisionesRequest = (comision) =>
  axios.post('/comisiones', comision)

// Edita comisión (PUT /comisiones/:id)
export const updateComisionesRequest = (id, comision) =>
  axios.put(`/comisiones/${id}`, comision)

// Borra comisión (DELETE /comisiones/:id)
export const deleteComisionesRequest = (id) =>
  axios.delete(`/comisiones/${id}`)
