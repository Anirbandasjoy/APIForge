import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '@/utils/response';

const validateRequest =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        headers: req.headers,
        cookies: req.cookies,
        params: req.params,
      });
      next();
    } catch (error: any) {
      sendErrorResponse(res, {
        statusCode: 400,
        message: 'Validation Error',
        error: error.errors.map((err: any) => ({
          message: err.message,
          path: err.path,
          expected: err.expected,
        })),
      });
    }
  };

export default validateRequest;
