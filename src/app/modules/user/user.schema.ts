import { z } from 'zod';
import { USER_ROLES } from './user.constant';

const UserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }).trim(),
    profilePicture: z
      .string()
      .url({ message: 'Invalid URL for profile picture' })
      .trim()
      .optional(),
    lastLogin: z.string().nullable().optional(),
    isActive: z.boolean().optional().default(true),
    twoFactor: z
      .object({
        code: z.string().min(6).max(6).trim().optional(),
        expiresAt: z.date().optional(),
        isEnabled: z.boolean().default(false),
      })
      .optional(),
    role: z
      .enum(Object.values(USER_ROLES) as [string, ...string[]])
      .default('user')
      .optional(),
  }),
});

const tokenSchema = z.object({
  body: z.object({
    token: z
      .string({ required_error: 'Token is required' })
      .min(10, { message: 'Token is too short' })
      .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
        message: 'Invalid token format (expected JWT)',
      })
      .trim(),
  }),
});

export type UserSchema = z.infer<typeof UserSchema>['body'];
export type TokenInput = z.infer<typeof tokenSchema>['body'];

const UserUpdateSchema = UserSchema.partial().extend({
  body: UserSchema.shape.body.partial(),
});

export const userValidationSchema = {
  UserSchema,
  tokenSchema,
  UserUpdateSchema,
};
