import catchAsync from '@/utils/catchAsync';
import { processUserRegistration, registerUser } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

import { generateCookie } from '@/utils/cookie/cookie';
import { expiresAccessTokenInMs, expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';
import useragent from 'useragent';
import { qb } from '@/app/query/qb';
import UserModel, { IUser } from './user.model';

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
  const { meta, data } = await qb<IUser>(UserModel)
    .select('-password')
    .filter({ role: req.query.role })
    .search(req.query.search, ['name', 'email'])
    .sort('-createdAt')
    .exec();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: { meta, data },
  });
});
