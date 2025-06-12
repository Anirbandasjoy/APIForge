import { Response } from 'express';

interface IApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
  error?: any;
}

export const sendSuccessResponse = <T>(
  res: Response,
  { statusCode = 200, message = 'Success', data }: Omit<IApiResponse<T>, 'success'>
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
    statusCode = 500,
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
