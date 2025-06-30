import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface IApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
  error?: any;
}

export const sendSuccessResponse = <T>(
  res: Response,
  { statusCode = StatusCodes.OK, message = 'Success', data }: Omit<IApiResponse<T>, 'success'>
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    message = 'Something went wrong',
    error,
  }: {
    statusCode?: number;
    message?: string;
    error?: any;
  }
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error,
  });
};
