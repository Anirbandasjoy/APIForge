import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const handleJWTError = (err: JsonWebTokenError | TokenExpiredError) => {
  const isExpired = err instanceof TokenExpiredError;

  return {
    statusCode: 401,
    message: isExpired ? 'Token expired' : 'Invalid token',
    errorDetails: err.message,
  };
};
