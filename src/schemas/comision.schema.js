import { z } from 'zod';

export const createComisionSchema = z.object({
    numeroComision: z.string({
        required_error: 'Comision obligatoria',
    }),
    preceptor: z.string({
        required_error: 'Preceptor obligatorio',
    }),
});
