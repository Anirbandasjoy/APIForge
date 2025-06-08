import catchAsync from '@/utils/catchAsync';
import { getUsers, processUserRegistration, registerUser } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@/app/errors/apiError';

export const processUserRegistrationHandler = catchAsync(async (req, res) => {
  const { message } = await processUserRegistration(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message,
  });
});

export const registerUserHandler = catchAsync(async (req, res) => {
  await registerUser(req.body.token);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User registered successfully',
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
