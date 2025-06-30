import { z } from 'zod';

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address').trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

const cookieRefreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Refresh token is required'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().nonempty('Token is required').trim(),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters long')
      .trim(),
  }),
});
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address').trim(),
  }),
});

const passwordSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'password is required' })
      .min(8, 'password must be at least 8 characters long')
      .trim(),
  }),
});

const verifyCodeSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address').trim(),
    code: z.string({ required_error: '2 factor authentication code is required' }).trim(),
  }),
});

export type PasswordSchema = z.infer<typeof passwordSchema>['body'];

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>['body'];
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>['body'];

export type CookieRefreshToken = z.infer<typeof cookieRefreshToken>['cookies'];
export type loginSchema = z.infer<typeof loginSchema>['body'];

export type verify2FACodeType = z.infer<typeof verifyCodeSchema>['body'];

export const authSchema = {
  loginSchema,
  cookieRefreshToken,
  resetPasswordSchema,
  forgotPasswordSchema,
  passwordSchema,
  verifyCodeSchema,
};
