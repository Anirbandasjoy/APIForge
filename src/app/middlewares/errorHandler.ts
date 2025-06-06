import ApiError from '@/utils/apiError';
import { sendErrorResponse } from '@/utils/response';
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

import { StatusCodes, getReasonPhrase } from 'http-status-codes';

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  let errorDetail: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetail = err.stack;
  } else if ('statusCode' in err && 'message' in err) {
    statusCode = (err as any).statusCode || statusCode;
    message = err.message;
    errorDetail = err.stack;
  } else if (err.message) {
    message = err.message;
    errorDetail = err.stack;
  }

  if (process.env.NODE_ENV === 'production') {
    errorDetail = undefined;
  }

  sendErrorResponse(res, {
    statusCode,
    message,
    error: errorDetail,
  });
};

export default errorHandler;
