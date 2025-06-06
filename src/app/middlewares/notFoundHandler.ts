import { sendErrorResponse } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  const statusCode = StatusCodes.NOT_FOUND;
  const message = getReasonPhrase(StatusCodes.NOT_FOUND);

  sendErrorResponse(res, {
    statusCode,
    message,
    error: `Route ${req.originalUrl} not found`,
  });
};

export default notFoundHandler;
