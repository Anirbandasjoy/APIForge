import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { generateCookie } from '@/utils/cookie/cookie';
import { expiresAccessTokenInMs, expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';
import { qb } from '@/app/libs/qb';
import UserModel, { IUser } from './user.model';
import { ub } from '@/app/libs/updateBuilder';
import { findById } from '@/services/existCheckService';
import { BadRequestError, NotFoundError } from '@/app/errors/apiError';
import { userService } from './user.service';

const processUserRegistrationHandler = catchAsync(async (req, res) => {
  const { message, token } = await userService.processUserRegistration(req.body);
  sendSuccessResponse(res, {
    message,
    data: token,
  });
});

const registerUserHandler = catchAsync(async (req, res) => {
  const deviceInfo = req.deviceInfo;

  const { data, accessToken, refreshToken } = await userService.registerUser(
    req.body.token,
    deviceInfo
  );

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

const getUsersHandler = catchAsync(async (req, res) => {
  const { meta, data } = await qb<IUser>(UserModel)
    .select('-password -createdAt -updatedAt')
    .filter({ role: req.query.role })
    .search(req.query.search, ['name', 'email',])
    .sort('-createdAt')
    .exec();

  sendSuccessResponse(res, {
    message: 'Users retrieved successfully',
    data: { meta, data },
  });
});

const userInfoUpdateHandler = catchAsync(async (req, res) => {
  const userUpdater = ub<IUser>(UserModel, 'name', 'profilePicture');
  const { data: user } = await userUpdater.updateById(req.params.id, req.body);
  sendSuccessResponse(res, {
    message: 'User updated successfully',
    data: user,
  });
});

const userDeActiveHandler = catchAsync(async (req, res) => {
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
    message: 'User deleted successfully',
    data: user,
  });
});

const userInfoHandler = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select('-password -createdAt -updatedAt');
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    return;
  }
  sendSuccessResponse(res, {
    message: 'User retrieved successfully',
    data: user,
  });
});

const userPermanentHandler = catchAsync(async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    throw NotFoundError('User not found');
  }
  sendSuccessResponse(res, {
    message: 'User permanently deleted successfully',
    data: user,
  });
});

export const userController = {
  processUserRegistrationHandler,
  registerUserHandler,
  getUsersHandler,
  userInfoUpdateHandler,
  userDeActiveHandler,
  userInfoHandler,
  userPermanentHandler,
};
