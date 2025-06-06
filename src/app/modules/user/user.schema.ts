import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z
      .enum(['user', 'admin', 'superadmin'], {
        required_error: 'Role is required',
        invalid_type_error: 'Role must be one of user, admin, or superadmin',
      })
      .optional()
      .default('user'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
