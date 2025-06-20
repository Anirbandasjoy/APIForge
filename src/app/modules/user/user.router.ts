import { Router } from 'express';

import validateRequest from '@/app/middlewares/validateRequest';

import {
  getUsersHandler,
  processUserRegistrationHandler,
  registerUserHandler,
  userDeleteHandler,
  userInfoHandler,
  userInfoUpdateHandler,
  userPermanentHandler,
} from './user.controller';
import { tokenSchema, UserSchema, UserUpdateSchema } from './user.schema';
import { hasRole, isAuthenticated } from '../auth/auth.middleware';
import { USER_ROLES } from '@/app/constants/userRoles';
import { idSchema } from '@/app/schema/common.schema';

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

userRouter.patch(
  '/:id',
  validateRequest(idSchema),
  isAuthenticated,
  hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  userDeleteHandler
);

userRouter.put(
  '/:id',

  validateRequest(idSchema),
  validateRequest(UserUpdateSchema),
  isAuthenticated,
  hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  userInfoUpdateHandler
);

userRouter.get(
  '/:id',
  validateRequest(idSchema),
  isAuthenticated,
  hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  userInfoHandler
);

userRouter.delete(
  '/permanent/:id',
  validateRequest(idSchema),
  isAuthenticated,
  hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  userPermanentHandler
);

export default userRouter;
