import axios from './axios'
 
export const getComisionesRequest = () => axios.get('/comisiones')
export const getComisionRequest = (id) => axios.get(`/comisiones/${id}`)
export const createComisionesRequest = (comision) => axios.post('/comisiones',comision)
export const updateComisionesRequest = (id,comision) => axios.put(`/comisiones/${id}`,comision);
export const deleteComisionesRequest = (id) => axios.delete(`/comisiones/${id}`)
