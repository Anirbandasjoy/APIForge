import { Router } from 'express';

import validateRequest from '@/app/middlewares/validateRequest';

import {
  getUsersHandler,
  processUserRegistrationHandler,
  registerUserHandler,
} from './user.controller';
import { tokenSchema, UserSchema } from './user.schema';
import { hasRole, isAuthenticated } from '../auth/auth.middleware';
import { USER_ROLES } from '@/app/constants/userRoles';

const userRouter = Router();

userRouter.post(
  '/process-registration',
  validateRequest(UserSchema),
  processUserRegistrationHandler
);
userRouter.post('/register', validateRequest(tokenSchema), registerUserHandler);
userRouter.get(
  '/',
  isAuthenticated,
  hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  getUsersHandler
);

export default userRouter;
