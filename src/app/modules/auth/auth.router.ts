import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import { loginLimiter } from '@/utils/loginLimiter';
import { isAuthenticated, isLogOut } from './auth.middleware';
import { authController } from './auth.controller';
import { authSchema } from './auth.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const authRouter: Router = Router();

defineRoutes(authRouter, [
  {
    method: 'post',
    path: '/login',
    middlewares: [loginLimiter, isLogOut, validateRequest(authSchema.loginSchema)],
    handler: authController.loginHandler,
  },
  {
    method: 'post',
    path: '/logout',
    middlewares: [loginLimiter, isAuthenticated],
    handler: authController.logOutHandler,
  },
  {
    method: 'get',
    path: '/refresh-token-to-access-token',
    middlewares: [validateRequest(authSchema.cookieRefreshToken)],
    handler: authController.refreshToAccessTokenGeneratorHandler,
  },
  {
    method: 'post',
    path: '/forgot-password',
    middlewares: [loginLimiter, validateRequest(authSchema.forgotPasswordSchema)],
    handler: authController.forgotPasswordHandler,
  },
  {
    method: 'put',
    path: '/reset-password',
    middlewares: [loginLimiter, validateRequest(authSchema.resetPasswordSchema)],
    handler: authController.resetPasswordHandler,
  },
  {
    method: 'delete',
    path: '/delete-account',
    middlewares: [isAuthenticated],
    handler: authController.userAccountDeleteHandler,
  },
  {
    method: 'post',
    path: '/enable-2fa',
    middlewares: [validateRequest(authSchema.passwordSchema), isAuthenticated],
    handler: authController.enabled2FAHandler,
  },
  {
    method: 'post',
    path: '/disable-2fa',
    middlewares: [validateRequest(authSchema.passwordSchema), isAuthenticated],
    handler: authController.disable2FAHandler,
  },
]);

export default authRouter;
