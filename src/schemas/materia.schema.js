import { z } from 'zod';

export const createMateriaSchema = z.object({
    nombreMateria: z.string({
        required_error: 'Materia obligatoria',
    }),
    docente: z.string({
        required_error: 'Docente obligatorio',
    }),
    comision: z.string({
        required_error: 'Comision obligatoria',
    }),
});
