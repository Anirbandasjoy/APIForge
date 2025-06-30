import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';

import { tokenSchema, UserSchema, UserUpdateSchema } from './user.schema';
import { idSchema } from '@/app/schema/common.schema';
import { hasRole, isAuthenticated } from '../auth/auth.middleware';
import { USER_ROLES } from './user.constant';
import { defineRoutes } from '@/utils/defineRoutes';
import { userController } from './user.controller';

const userRouter = Router();

defineRoutes(userRouter, [
  {
    method: 'post',
    path: '/process-registration',
    middlewares: [validateRequest(UserSchema)],
    handler: userController.processUserRegistrationHandler,
  },
  {
    method: 'post',
    path: '/register',
    middlewares: [validateRequest(tokenSchema)],
    handler: userController.registerUserHandler,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [isAuthenticated, hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN)],
    handler: userController.getUsersHandler,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userDeActiveHandler,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      validateRequest(UserUpdateSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userInfoUpdateHandler,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userInfoHandler,
  },
  {
    method: 'delete',
    path: '/permanent/:id',
    middlewares: [
      validateRequest(idSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userPermanentHandler,
  },
]);

export default userRouter;
