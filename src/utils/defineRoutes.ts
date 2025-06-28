import { Router } from 'express';

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface RouteConfig {
  method: HTTPMethod;
  path: string;
  middlewares?: any[];
  handler: any;
}

export const defineRoutes = (router: Router, routes: RouteConfig[]) => {
  routes.forEach(({ method, path, middlewares = [], handler }) => {
    (router as any)[method](path, ...middlewares, handler);
  });
};
