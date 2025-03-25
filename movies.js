import z from 'zod';

const movieSchema = z.object({
        title: z.string({
            message: 'El título es requerido'
        }).nonempty(),
        year: z.number().int().min(1900).max(2025),
        director: z.string().nonempty(),
        duration: z.number().int().positive(),
        poster: z.string().url({
            message: 'La URL del poster es requerida'
        }).endsWith('.jpg').optional(),
        genre: z.array(z.string()).nonempty(), //z.enum(['comedy', 'action', 'drama', 'horror', 'sci-fi']),
        rate: z.number().min(0).max(10).optional()
    });

function validate(data){
    return movieSchema.safeParse(data);
}

function validatePatch(data){
    return movieSchema.partial().safeParse(data);
}

export { validate, validatePatch };