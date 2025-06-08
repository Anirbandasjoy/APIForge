import { z } from 'zod';

export const UserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    profilePicture: z.string().url({ message: 'Invalid URL for profile picture' }).optional(),
    role: z
      .enum(['user', 'admin', 'superadmin'], {
        required_error: 'Role is required',
        invalid_type_error: 'Role must be one of user, admin, or superadmin',
      })
      .optional()
      .default('user'),
  }),
});

export const tokenSchema = z.object({
  token: z
    .string({ required_error: 'Token is required' })
    .min(10, { message: 'Token is too short' })
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
      message: 'Invalid token format (expected JWT)',
    }),
});

export type UserSchema = z.infer<typeof UserSchema>['body'];
export type TokenInput = z.infer<typeof tokenSchema>;
