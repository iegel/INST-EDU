import { z } from 'zod';

export const createAlumnoSchema = z.object({
    nombre: z.string({
        required_error: 'Nombre obligatorio',
    }),
    apellido: z.string({
        required_error: 'Apellido obligatorio',
    }),
    dni: z.string({
        required_error: 'DNI obligatorio',
    }), 
    año: z.string({
        required_error: 'Año obligatorio',
    }), // Agregamos el campo año como número entero
});