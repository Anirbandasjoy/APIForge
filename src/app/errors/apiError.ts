import { StatusCodes } from 'http-status-codes';

class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience helper for creating common errors
export const BadRequestError = (message = 'Bad Request') =>
  new ApiError(StatusCodes.BAD_REQUEST, message);

export const NotFoundError = (message = 'Not Found') =>
  new ApiError(StatusCodes.NOT_FOUND, message);

export const UnauthorizedError = (message = 'Unauthorized') =>
  new ApiError(StatusCodes.UNAUTHORIZED, message);

export const ForbiddenError = (message = 'Forbidden') =>
  new ApiError(StatusCodes.FORBIDDEN, message);

export const InternalServerError = (message = 'Internal Server Error') =>
  new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message);

export const ConflictError = (message = 'Conflict') => new ApiError(StatusCodes.CONFLICT, message);

export const UnprocessableEntityError = (message = 'Unprocessable Entity') =>
  new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message);

export const ServiceUnavailableError = (message = 'Service Unavailable') =>
  new ApiError(StatusCodes.SERVICE_UNAVAILABLE, message);

// export const NON_AUTHORITATIVE_INFORMATION

export const NonAuthoritativeInformation = (message = 'Non Authoritative Information') =>
  new ApiError(StatusCodes.NON_AUTHORITATIVE_INFORMATION, message);

export default ApiError;
