import { BadRequestError, NotFoundError, UnauthorizedError } from '@/app/errors/apiError';
import UserModel from '../user/user.model';
import { loginSchema } from './auth.schema';
import { comparePassword, hashPassword } from '@/utils/hash';
import { Types } from 'mongoose';
import {
  forgotPasswordTokenVerifier,
  generateToken,
  verifyRefreshToken,
} from '@/utils/token/token';
import {
  CLIENT_URI,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN,
  JWT_PASSWORD_FORGOT_PASSWORD_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
} from '@/config/env';
import { checkAndCreateSession } from '../session/session.service';
import { IDeviceInfo, SessionModel } from '../session/session.model';
import { CookieOptions } from 'express';
import { loadEmailTemplate } from '@/utils/email/loadEmailTemplate';
import sendingEmail from '@/services/email/emailSender';

export const loginUser = async (loginInfo: loginSchema, deviceInfo?: IDeviceInfo) => {
  const user = await UserModel.findOne({ email: loginInfo.email });
  if (!user) throw NotFoundError('User not registered');
  if (!user.isActive) throw UnauthorizedError('User account is inactive');

  if (user.twoFactor && user.twoFactor.isEnabled) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.twoFactor.code = code;
    user.twoFactor.expiresAt = expireAt;
    await user.save();

    const emailData = {
      to: user.email,
      subject: 'Two-Factor Authentication Code',
      html: ` <p>2FA Code</p>
          <p>Your 2FA code is: ${code}</p>`,
    };

    try {
      await sendingEmail(emailData);
    } catch (error) {
      const err = new Error('Failed to send 2FA code via email');
      // Optionally attach the original error for debugging
      (err as any).cause = error;
      throw err;
    }

    throw UnauthorizedError('Two-factor authentication is enabled. Please verify your code.');
  }

  const matchPassword = await comparePassword(loginInfo.password, user.password);
  if (!matchPassword) throw BadRequestError('Invalid credentials');

  const { sessionId, warning } = await checkAndCreateSession(
    user._id as Types.ObjectId,
    deviceInfo
  );

  if (warning) {
    throw new Error(warning);
  }

  const data = {
    user: {
      _id: user._id as Types.ObjectId,
    },
    sessionId,
  };

  const accessToken = generateToken(data, JWT_ACCESS_SECRET_KEY as string, JWT_ACCESS_EXPIRES_IN);
  if (!accessToken) throw UnauthorizedError('Access token creation failed');

  const refreshToken = generateToken(
    data,
    JWT_REFRESH_SECRET_KEY as string,
    JWT_REFRESH_EXPIRES_IN
  );
  if (!refreshToken) throw UnauthorizedError('Refresh token creation failed');

  return { accessToken, refreshToken, user };
};

export const refreshToAccessTokenGenerator = async (token: string) => {
  const { decodedToken } = verifyRefreshToken(token);

  const data = {
    user: decodedToken.user,
    sessionId: decodedToken.sessionId,
  };
  const accessToken = generateToken(data, JWT_ACCESS_SECRET_KEY as string, JWT_ACCESS_EXPIRES_IN);
  if (!accessToken) throw UnauthorizedError('Access token creation failed');
  return { accessToken };
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw NotFoundError('User not registered');

  const token = generateToken(
    { email },
    JWT_PASSWORD_FORGOT_PASSWORD_SECRET as string,
    JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN
  );
  if (!token) throw UnauthorizedError('Token creation failed');

  const html = loadEmailTemplate('resetPassword.html', {
    user_name: user.name,
    reset_link: CLIENT_URI + '/reset-password?token=' + token,
  });

  const emailData = {
    to: email,
    subject: 'Password Reset Request',
    html,
  };

  try {
    await sendingEmail(emailData);
  } catch (error) {
    throw error;
  }

  return {
    message: `Password reset link sent to ${email}. Please check your email.`,
    token,
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const decoded = forgotPasswordTokenVerifier(token);

  if (!decoded) throw UnauthorizedError('Invalid or expired token');
  const filter = { email: decoded.email };
  const update = { password: await hashPassword(newPassword) };
  const option = { new: true };
  const updateUser = await UserModel.findOneAndUpdate(filter, update, option);
  if (!updateUser) throw NotFoundError('User not found or password update failed');
  return { message: 'Password reset successfully' };
};

export const deleteUserAccount = async (userId: Types.ObjectId, password: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw NotFoundError('User not registered');
  const matchPassword = await comparePassword(password, user.password);
  if (!matchPassword) throw UnauthorizedError('Invalid credentials');
  await UserModel.findByIdAndDelete(userId);
  await SessionModel.deleteMany({ userId });
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    secure: process.env.NODE_ENV === 'production',
  };

  return {
    message: 'User account deleted successfully',
    cookieOptions,
  };
};

export const enabled2FA = async (userId: Types.ObjectId, password: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw NotFoundError('User not found');

  const matchPassword = await comparePassword(password, user.password);
  if (!matchPassword) throw UnauthorizedError('Invalid credentials');

  if (!user.twoFactor) {
    user.twoFactor = {
      isEnabled: true,
      code: '',
      expiresAt: undefined,
    };
  } else {
    user.twoFactor.isEnabled = true;
  }
  await user.save();
  return {
    message: 'Two-factor authentication enabled successfully',
  };
};

export const disabled2FA = async (userId: Types.ObjectId, password: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw NotFoundError('User not found');

  const matchPassword = await comparePassword(password, user.password);
  if (!matchPassword) throw UnauthorizedError('Invalid credentials');

  if (!user.twoFactor) {
    user.twoFactor = {
      isEnabled: false,
      code: '',
      expiresAt: undefined,
    };
  } else {
    user.twoFactor.isEnabled = false;
    user.twoFactor.code = '';
    user.twoFactor.expiresAt = undefined;
  }
  await user.save();
  return {
    message: 'Two-factor authentication disabled successfully',
  };
};
