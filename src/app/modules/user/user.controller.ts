import catchAsync from '@/utils/catchAsync';
import { getUsers, processUserRegistration, registerUser } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@/app/errors/apiError';
import { generateCookie } from '@/utils/cookie/cookie';

export const processUserRegistrationHandler = catchAsync(async (req, res) => {
  const { message, token } = await processUserRegistration(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message,
    data: token,
  });
});

export const registerUserHandler = catchAsync(async (req, res) => {
  const { data, accessToken, refreshToken } = await registerUser(req.body.token);
  generateCookie({
    res,
    token: accessToken,
    tokenName: 'accessToken',
    maxAge: 15 * 60 * 1000,
  });
  generateCookie({
    res,
    token: refreshToken,
    tokenName: 'refreshToken',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User registered successfully',
    data,
  });
});

export const getUsersHandler = catchAsync(async (req, res) => {
  const users = await getUsers(req.query as Record<string, any>, {
    select: '-password',
  });

  if (!users || users.data.length === 0) {
    throw BadRequestError('No users found');
  }

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: users,
  });
});
