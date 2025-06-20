import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import {
  cookieRefreshToken,
  forgotPasswordSchema,
  loginSchema,
  passwordSchema,
  resetPasswordSchema,
} from './auth.schema';
import {
  disable2FAHandler,
  enabled2FAHandler,
  forgotPasswordHandler,
  loginHandler,
  logOutHandler,
  refreshToAccessTokenGeneratorHandler,
  resetPasswordHandler,
  userAccountDeleteHandler,
} from './auth.controller';
import { loginLimiter } from '@/utils/loginLimiter';
import { isAuthenticated, isLogOut } from './auth.middleware';

const authRouter: Router = Router();

authRouter.post('/login', loginLimiter, isLogOut, validateRequest(loginSchema), loginHandler);
authRouter.post('/logout', loginLimiter, isAuthenticated, logOutHandler);
authRouter.get(
  '/refresh-token-to-access-token',
  validateRequest(cookieRefreshToken),
  refreshToAccessTokenGeneratorHandler
);

authRouter.post(
  '/forgot-password',
  loginLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPasswordHandler
);
authRouter.put(
  '/reset-password',
  loginLimiter,
  validateRequest(resetPasswordSchema),
  resetPasswordHandler
);

authRouter.delete('/delete-account', isAuthenticated, userAccountDeleteHandler);

authRouter.post('/enable-2fa', validateRequest(passwordSchema), isAuthenticated, enabled2FAHandler);
authRouter.post(
  '/disable-2fa',
  validateRequest(passwordSchema),
  isAuthenticated,
  disable2FAHandler
);

export default authRouter;
