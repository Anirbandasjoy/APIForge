import { Router } from 'express';
import userRouter from '@/app/modules/user/user.router';

const router = Router();

const routes = [
  {
    path: '/users',
    router: userRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
