import catchAsync from '@/utils/catchAsync';
import { getUsers, processUserRegistration, registerUser } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@/app/errors/apiError';
import { generateCookie } from '@/utils/cookie/cookie';
import { expiresAccessTokenInMs, expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';
import useragent from 'useragent';

export const processUserRegistrationHandler = catchAsync(async (req, res) => {
  const { message, token } = await processUserRegistration(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message,
    data: token,
  });
});

export const registerUserHandler = catchAsync(async (req, res) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = {
    browser: agent.toAgent(),
    os: agent.os.toString(),
    ip: req.ip || 'unknown ip',
  };

  const { data, accessToken, refreshToken } = await registerUser(req.body.token, deviceInfo);

  if (typeof expiresRefreshTokenInMs !== 'number') {
    throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
  }
  if (typeof expiresAccessTokenInMs !== 'number') {
    throw new Error('Invalid JWT_ACCESS_EXPIRES_IN format');
  }

  generateCookie({
    res,
    token: accessToken,
    tokenName: 'accessToken',
    maxAge: expiresAccessTokenInMs,
  });
  generateCookie({
    res,
    token: refreshToken,
    tokenName: 'refreshToken',
    maxAge: expiresRefreshTokenInMs,
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
