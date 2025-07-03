import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import { loginLimiter } from '@/utils/loginLimiter';
import { authController } from './auth.controller';
import { authSchema } from './auth.schema';
import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddlewares } from './auth.middleware';

const authRouter: Router = Router();

defineRoutes(authRouter, [
  {
    method: 'post',
    path: '/login',
    middlewares: [
      loginLimiter,
      authMiddlewares.isLogOut,
      authMiddlewares.detectDeviceInfo,
      validateRequest(authSchema.loginSchema),
    ],
    handler: authController.loginHandler,
  },
  {
    method: 'post',
    path: '/logout',
    middlewares: [loginLimiter, authMiddlewares.isAuthenticated],
    handler: authController.logOutHandler,
  },
  {
    method: 'post',
    path: '/logout-all-device',
    middlewares: [loginLimiter, authMiddlewares.isAuthenticated],
    handler: authController.logOutAllDevices,
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
    middlewares: [loginLimiter, authMiddlewares.isAuthenticated],
    handler: authController.userAccountDeleteHandler,
  },
  {
    method: 'post',
    path: '/enable-2fa',
    middlewares: [
      loginLimiter,
      validateRequest(authSchema.passwordSchema),
      authMiddlewares.isAuthenticated,
    ],
    handler: authController.enabled2FAHandler,
  },
  {
    method: 'post',
    path: '/disable-2fa',
    middlewares: [
      loginLimiter,
      validateRequest(authSchema.passwordSchema),
      authMiddlewares.isAuthenticated,
    ],
    handler: authController.disable2FAHandler,
  },
  {
    method: 'put',
    path: '/verify-2fa',
    middlewares: [validateRequest(authSchema.verifyCodeSchema), authMiddlewares.detectDeviceInfo],
    handler: authController.verify2FAHandler,
  },
]);

export default authRouter;
