import catchAsync from '@/utils/catchAsync';
import { createUser, getUsers } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '@/utils/apiError';
import { exists } from '@/services/existCheckService';
import UserModel from './user.model';

export const createUserHandler = catchAsync(async (req, res) => {
  const existingUser = await exists(UserModel, { email: req.body.email });

  if (existingUser) {
    throw BadRequestError('User already exists with this email');
  }

  const user = await createUser(req.body);
  if (!user) {
    throw BadRequestError('User registration failed');
  }

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
    data: user,
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
