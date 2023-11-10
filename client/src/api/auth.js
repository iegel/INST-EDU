import axios from "./axios"

export const registerRequest = (user) => axios.post(`/register`,user); // Crear register request, me van a pasar un usuario y voy a pasa una peticion al 'http://localhost:4000/api/register' con el usuario que me estan pasando  

export const loginRequest = (user) => axios.post(`/login`,user);

export const verifyTokenRequest = () => axios.get ('/verify');
