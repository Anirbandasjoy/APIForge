import { z } from 'zod';

// validate mongodb id in params
export const idSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format'),
  }),
});

export type idSchema = z.infer<typeof idSchema>['params'];
