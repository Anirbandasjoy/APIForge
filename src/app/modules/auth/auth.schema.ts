import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

export const cookieRefreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Refresh token is required'),
  }),
});

export type CookieRefreshToken = z.infer<typeof cookieRefreshToken>['cookies'];
export type loginSchema = z.infer<typeof loginSchema>['body'];
