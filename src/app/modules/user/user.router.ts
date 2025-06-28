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
import { idSchema } from '@/app/schema/common.schema';
import { hasRole, isAuthenticated } from '../auth/auth.middleware';
import { USER_ROLES } from './user.constant';
import { defineRoutes } from '@/utils/defineRoutes';

const userRouter = Router();

defineRoutes(userRouter, [
  {
    method: 'post',
    path: '/process-registration',
    middlewares: [validateRequest(UserSchema)],
    handler: processUserRegistrationHandler,
  },
  {
    method: 'post',
    path: '/register',
    middlewares: [validateRequest(tokenSchema)],
    handler: registerUserHandler,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [isAuthenticated, hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN)],
    handler: getUsersHandler,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userDeleteHandler,
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
    handler: userInfoUpdateHandler,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [
      validateRequest(idSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userInfoHandler,
  },
  {
    method: 'delete',
    path: '/permanent/:id',
    middlewares: [
      validateRequest(idSchema),
      isAuthenticated,
      hasRole(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    ],
    handler: userPermanentHandler,
  },
]);

export default userRouter;
