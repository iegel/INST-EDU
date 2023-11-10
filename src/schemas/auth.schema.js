import {z} from 'zod'
//Para validar si los datos que llegan desde el cliente son correctos

export const registerSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
    }),
    email:z.string({
        required_error: 'Username is required',
    }).email({
        message: 'Invalid email',
    }),
    password: z.string({
        required_error: 'Password is required',
    }).min(6,{
        message : 'La contraseña debe tener al menos 6 caracteres',
    }),
});

export const loginSchema = z.object({
    email : z.string({
        required_error: 'Email is required',
    }).email({
        message : 'Email is not valid',
    }),
    password : z.string({
        required_error: 'Password is required',
    }).min(6,{
        message : 'La contraseña debe tener al menos 6 caracteres',
    }),    
});