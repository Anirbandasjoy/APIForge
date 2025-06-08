import { sendErrorResponse } from '@/utils/response';
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { handleZodError } from '../errors/handlers/zodErrorHandler';
import { handleMongooseCastError } from '../errors/handlers/mongooseCastErrorHandler';
import { handleDuplicateKeyError } from '../errors/handlers/duplicateKeyErrorHandler';
import { handleMongooseValidationError } from '../errors/handlers/mongooseValidationErrorHandler';
import { handleSyntaxError } from '../errors/handlers/syntaxErrorHandler';
import { handleJWTError } from '../errors/handlers/jwtErrorHandler';
import ApiError from '../errors/apiError';

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  let errorDetails: any = undefined;

  // Zod Error
  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // Mongoose CastError
  else if (err instanceof mongoose.Error.CastError) {
    const simplified = handleMongooseCastError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // Mongoose ValidationError
  else if (err instanceof mongoose.Error.ValidationError) {
    const simplified = handleMongooseValidationError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // Mongo Duplicate Key Error
  else if (err instanceof MongoServerError && err.code === 11000) {
    const simplified = handleDuplicateKeyError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // SyntaxError (Invalid JSON)
  else if (err instanceof SyntaxError && 'body' in err) {
    const simplified = handleSyntaxError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // JWT Errors
  else if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    const simplified = handleJWTError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // Nodemailer: Missing credentials error
  else if (
    typeof err.message === 'string' &&
    err.message.includes('Missing credentials for "PLAIN"')
  ) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = 'Email service credentials are missing. Please check SMTP configuration.';
    errorDetails = err.stack;
  }

  // Custom ApiError
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.stack;
  }

  // Generic Error with statusCode and message
  else if ('statusCode' in err && 'message' in err) {
    statusCode = err.statusCode || statusCode;
    message = err.message;
    errorDetails = err.stack;
  }

  // Fallback
  else if (err.message) {
    message = err.message;
    errorDetails = err.stack;
  }

  if (process.env.NODE_ENV === 'production') {
    errorDetails = undefined;
  }

  sendErrorResponse(res, {
    statusCode,
    message,
    error: errorDetails,
  });
};

export default errorHandler;
