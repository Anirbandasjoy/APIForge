import catchAsync from '@/utils/catchAsync';
import { createUser } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '@/utils/apiError';

export const createUserHandler = catchAsync(async (req, res) => {
  const user = await createUser(req.body);

  let hello = 'Hello World!';
  console.log(hello);
  if (!user) {
    throw BadRequestError('User registration failed');
  }

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
    data: user,
  });
});
