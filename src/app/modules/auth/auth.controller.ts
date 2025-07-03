import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';

import { cookieOptions, generateCookie } from '@/utils/cookie/cookie';

import { SessionModel } from '../session/session.model';
import { expiresAccessTokenInMs, expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';
import { NotFoundError, UnauthorizedError } from '@/app/errors/apiError';
import { Types } from 'mongoose';
import { authService } from './auth.service';

const loginHandler = catchAsync(async (req, res) => {
  const deviceInfo = req.deviceInfo;

  const loginResult = await authService.loginUser(req.body, deviceInfo);

  if (loginResult.requiresTwoFactor) {
    sendSuccessResponse(res, {
      message: loginResult.message,
      data: loginResult.user,
    });
  }

  const { accessToken, refreshToken, user } = loginResult;

  if (typeof expiresRefreshTokenInMs !== 'number') {
    throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
  }
  if (typeof expiresAccessTokenInMs !== 'number') {
    throw new Error('Invalid JWT_ACCESS_EXPIRES_IN format');
  }

  if (!accessToken || !refreshToken) {
    throw NotFoundError('Tokens are missing from login result');
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
    message: 'Login successfully',
    data: user,
  });
});

const logOutHandler = catchAsync(async (req, res) => {
  await SessionModel.findOneAndDelete({ sessionId: req.user?.sessionId });
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  sendSuccessResponse(res, {
    message: 'LogOut successfully',
  });
});

const logOutAllDevices = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await SessionModel.deleteMany({ userId });

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendSuccessResponse(res, {
    message: 'Logged out from all devices successfully',
  });
});

const refreshToAccessTokenGeneratorHandler = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const exist = req.cookies.accessToken;

  if (exist) {
    throw UnauthorizedError('You are already logged in');
  }

  const { accessToken } = await authService.refreshToAccessTokenGenerator(refreshToken);

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

const forgotPasswordHandler = catchAsync(async (req, res) => {
  const { message, token } = await authService.forgotPassword(req.body.email);
  sendSuccessResponse(res, {
    message,
    data: { token },
  });
});

const resetPasswordHandler = catchAsync(async (req, res) => {
  const { message } = await authService.resetPassword(req.body.token, req.body.newPassword);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  sendSuccessResponse(res, {
    message,
  });
});

const userAccountDeleteHandler = catchAsync(async (req, res) => {
  const userId = new Types.ObjectId(req.user._id);
  const { message, cookieOptions } = await authService.deleteUserAccount(userId, req.body.password);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  sendSuccessResponse(res, {
    message,
  });
});

const enabled2FAHandler = catchAsync(async (req, res) => {
  const userId = new Types.ObjectId(req.user._id);
  const { message } = await authService.enabled2FA(userId, req.body.password);
  sendSuccessResponse(res, {
    message,
  });
});

const disable2FAHandler = catchAsync(async (req, res) => {
  const userId = new Types.ObjectId(req.user._id);
  const { message } = await authService.disabled2FA(userId, req.body.password);
  sendSuccessResponse(res, {
    message,
  });
});

const verify2FAHandler = catchAsync(async (req, res) => {
  const deviceInfo = req.deviceInfo;

  const { accessToken, refreshToken, user } = await authService.verify2FACode(req.body, deviceInfo);
  if (typeof expiresRefreshTokenInMs !== 'number') {
    throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
  }
  if (typeof expiresAccessTokenInMs !== 'number') {
    throw new Error('Invalid JWT_ACCESS_EXPIRES_IN format');
  }

  if (!accessToken || !refreshToken) {
    throw NotFoundError('Tokens are missing from login result');
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
    message: 'Login successfully',
    data: user,
  });
});

export const authController = {
  loginHandler,
  logOutHandler,
  logOutAllDevices,
  refreshToAccessTokenGeneratorHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  userAccountDeleteHandler,
  enabled2FAHandler,
  disable2FAHandler,
  verify2FAHandler,
};
