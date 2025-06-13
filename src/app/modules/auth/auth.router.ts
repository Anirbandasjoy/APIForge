import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import { cookieRefreshToken, loginSchema } from './auth.schema';
import {
  loginHandler,
  logOutHandler,
  refreshToAccessTokenGeneratorHandler,
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

export default authRouter;
