import { Router } from 'express';
import validateRequest from '@/app/middlewares/validateRequest';

import { tokenSchema, UserSchema, UserUpdateSchema } from './user.schema';
import { idSchema } from '@/app/schema/common.schema';
import { USER_ROLES } from './user.constant';
import { defineRoutes } from '@/utils/defineRoutes';
import { userController } from './user.controller';
import { authMiddlewares } from '../auth/auth.middleware';

const userRouter = Router();

defineRoutes(userRouter, [
  {
    method: 'post',
    path: '/process-registration',
    middlewares: [validateRequest(UserSchema), authMiddlewares.detectDeviceInfo],
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
    middlewares: [
      authMiddlewares.isAuthenticated,
      authMiddlewares.hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.getUsersHandler,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      authMiddlewares.isAuthenticated,
      authMiddlewares.hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userDeActiveHandler,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      validateRequest(UserUpdateSchema),
      authMiddlewares.isAuthenticated,
      authMiddlewares.hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userInfoUpdateHandler,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      authMiddlewares.isAuthenticated,
      authMiddlewares.hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userInfoHandler,
  },
  {
    method: 'delete',
    path: '/permanent/:id',
    middlewares: [
      validateRequest(idSchema),
      authMiddlewares.isAuthenticated,
      authMiddlewares.hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userController.userPermanentHandler,
  },
]);

export default userRouter;
