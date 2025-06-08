import { Router } from 'express';

import validateRequest from '@/app/middlewares/validateRequest';

import {
  getUsersHandler,
  processUserRegistrationHandler,
  registerUserHandler,
} from './user.controller';
import { tokenSchema, UserSchema } from './user.schema';

const userRouter = Router();

userRouter.post(
  '/process-registration',
  validateRequest(UserSchema),
  processUserRegistrationHandler
);
userRouter.post('/register', validateRequest(tokenSchema), registerUserHandler);
userRouter.get('/', getUsersHandler);

export default userRouter;
