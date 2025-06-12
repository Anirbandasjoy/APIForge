import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import { loginSchema } from './auth.schema';
import { loginHandler, logOutHandler } from './auth.controller';
import { loginLimiter } from '@/utils/loginLimiter';
import { isAuthenticated, isLogOut } from './auth.middleware';

const authRouter: Router = Router();

authRouter.post('/login', loginLimiter, isLogOut, validateRequest(loginSchema), loginHandler);
authRouter.post('/logout', loginLimiter, isAuthenticated, logOutHandler);

export default authRouter;
