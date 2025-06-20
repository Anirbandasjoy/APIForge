import catchAsync from '@/utils/catchAsync';
import { processUserRegistration, registerUser } from './user.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

import { generateCookie } from '@/utils/cookie/cookie';
import { expiresAccessTokenInMs, expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';
import useragent from 'useragent';
import { qb } from '@/app/libs/qb';
import UserModel, { IUser } from './user.model';
import { ub } from '@/app/libs/updateBuilder';
import { findById } from '@/services/existCheckService';
import { BadRequestError } from '@/app/errors/apiError';

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
    .select('-password -createdAt -updatedAt')
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

export const userInfoUpdateHandler = catchAsync(async (req, res) => {
  console.log('Updating user id:', req.params.id);
  console.log('Payload:', req.body);
  const userUpdater = ub<IUser>(UserModel, 'name', 'profilePicture');
  const { data: user } = await userUpdater.updateById(req.params.id, req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User updated successfully',
    data: user,
  });
});

export const userDeleteHandler = catchAsync(async (req, res) => {
  const check = await findById(UserModel, req.params.id);
  if (
    typeof check === 'object' &&
    check !== null &&
    'isActive' in check &&
    (check as { isActive: boolean }).isActive === false
  ) {
    throw BadRequestError('User is already deleted');
  }
  const userUpdate = ub<IUser>(UserModel, 'isActive');
  const { data: user } = await userUpdate.updateById(req.params.id, { isActive: false });
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: user,
  });
});

export const userInfoHandler = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select('-password -createdAt -updatedAt');
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    return;
  }
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});
