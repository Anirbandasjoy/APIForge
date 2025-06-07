import { Router } from 'express';
import { getUsersHandler, registerUserHandler } from './user.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { createUserSchema } from './user.schema';
import { processUserRegistration } from './user.service';

const userRouter = Router();

userRouter.post(
  '/process-registration',
  validateRequest(createUserSchema),
  processUserRegistration
);
userRouter.post('/register', validateRequest(createUserSchema), registerUserHandler);
userRouter.get('/', getUsersHandler);

export default userRouter;
