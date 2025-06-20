import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import {
  cookieRefreshToken,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from './auth.schema';
import {
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

export default authRouter;
