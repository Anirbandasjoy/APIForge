import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import {
  deleteUserAccount,
  forgotPassword,
  loginUser,
  refreshToAccessTokenGenerator,
  resetPassword,
} from './auth.service';
import { cookieOptions, generateCookie } from '@/utils/cookie/cookie';

import useragent from 'useragent';
import { SessionModel } from '../session/session.model';
import { expiresAccessTokenInMs, expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';
import { UnauthorizedError } from '@/app/errors/apiError';
import { Types } from 'mongoose';

export const loginHandler = catchAsync(async (req, res) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = {
    browser: agent.toAgent(),
    os: agent.os.toString(),
    ip: req.ip || 'unknown ip',
  };
  const { accessToken, refreshToken, user } = await loginUser(req.body, deviceInfo);

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
    statusCode: 200,
    message: 'Login successfully',
    data: user,
  });
});

export const logOutHandler = catchAsync(async (req, res) => {
  await SessionModel.findOneAndDelete({ sessionId: req.user?.sessionId });

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  sendSuccessResponse(res, {
    message: 'LogOut successfully',
  });
});

export const logOutAllDevices = catchAsync(async (req, res) => {
  const userId = req.user._id;

  await SessionModel.deleteMany({ userId });

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendSuccessResponse(res, {
    message: 'Logged out from all devices successfully',
  });
});

export const refreshToAccessTokenGeneratorHandler = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const exist = req.cookies.accessToken;

  if (exist) {
    throw UnauthorizedError('You are already logged in');
  }

  const { accessToken } = await refreshToAccessTokenGenerator(refreshToken);

  if (typeof expiresAccessTokenInMs !== 'number') {
    throw new Error('Invalid JWT_ACCESS_EXPIRES_IN format');
  }
  generateCookie({
    res,
    token: accessToken,
    tokenName: 'accessToken',
    maxAge: expiresAccessTokenInMs,
  });
  sendSuccessResponse(res, {
    message: 'New access token is Generated',
  });
});

export const forgotPasswordHandler = catchAsync(async (req, res) => {
  const { message, token } = await forgotPassword(req.body.email);
  sendSuccessResponse(res, {
    message,
    data: { token },
  });
});

export const resetPasswordHandler = catchAsync(async (req, res) => {
  const { message } = await resetPassword(req.body.token, req.body.newPassword);
  sendSuccessResponse(res, {
    message,
  });
});

export const userAccountDeleteHandler = catchAsync(async (req, res) => {
  const userId = new Types.ObjectId(req.user._id);
  const { message, cookieOptions } = await deleteUserAccount(userId, req.body.password);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  sendSuccessResponse(res, {
    message,
  });
});
