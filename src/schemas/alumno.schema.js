import { z } from 'zod';

export const createAlumnoSchema = z.object({
    nombre: z.string({
        required_error: 'Nombre obligatorio',
    }),
    apellido: z.string({
        required_error: 'Apellido obligatorio',
    }),
    dni: z.number()
    .refine((value) => Number.isInteger(value) && value.toString().length === 8, {
        message: 'El DNI debe ser un número entero de 8 dígitos',
    }),
    año: z.string({
        required_error: 'Año obligatorio',
    }), // Agregamos el campo año como número entero
});