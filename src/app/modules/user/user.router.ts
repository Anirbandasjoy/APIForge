import { Router } from 'express';
import { createUserHandler, getUsersHandler } from './user.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { createUserSchema } from './user.schema';

const userRouter = Router();

userRouter.post('/register', validateRequest(createUserSchema), createUserHandler);
userRouter.get('/', getUsersHandler);

export default userRouter;
