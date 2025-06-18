import { NotFoundError, UnauthorizedError } from '@/app/errors/apiError';
import UserModel from '../user/user.model';
import { loginSchema } from './auth.schema';
import { comparePassword } from '@/utils/hash';
import { Types } from 'mongoose';
import { generateToken, verifyRefreshToken } from '@/utils/token/token';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
} from '@/config/env';
import { checkAndCreateSession } from '../session/session.service';
import { IDeviceInfo } from '../session/session.model';

export const loginUser = async (loginInfo: loginSchema, deviceInfo?: IDeviceInfo) => {
  const user = await UserModel.findOne({ email: loginInfo.email });
  if (!user) throw NotFoundError('User not registered');

  const matchPassword = comparePassword(loginInfo.password, user.password);
  if (!matchPassword) throw NotFoundError('Invalid credentials');

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
