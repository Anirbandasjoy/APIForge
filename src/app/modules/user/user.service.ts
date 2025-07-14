import UserModel from './user.model';
import { UserSchema } from './user.schema';
import {
  BadRequestError,
  ConflictError,
  NonAuthoritativeInformation,
  UnauthorizedError,
} from '@/app/errors/apiError';
import { generateToken } from '@/utils/token/token';
import { loadEmailTemplate } from '@/utils/email/loadEmailTemplate';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import {
  CLIENT_URI,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_PROCESS_REGISTRATION_EXPIRIES_IN,
  JWT_PROCESS_REGISTRATION_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
} from '@/config/env';
import { IDeviceInfo } from '../session/session.model';
import { checkAndCreateSession } from '../session/session.service';
import sendingEmail from '@/services/email/emailSender';

const existUserByEmail = async <T>(
  model: any,
  email: string,
  options: Record<string, any> = {}
): Promise<T | null> => {
  try {
    if (!email) {
      throw BadRequestError('Email is required to find a user');
    }

    const query = { email };
    const user = await model.findOne(query, options).lean().exec();
    if (user) {
      throw ConflictError(`User Already Registered. Please Login`);
    }
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const processUserRegistration = async (userData: UserSchema) => {
  await existUserByEmail(UserModel, userData.email as string);

  const token = generateToken(
    {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profilePicture: userData.profilePicture,
    },
    JWT_PROCESS_REGISTRATION_SECRET_KEY as string,
    JWT_PROCESS_REGISTRATION_EXPIRIES_IN
  );
  if (!token) {
    throw BadRequestError('Failed to generate token for user registration');
  }

  const html = loadEmailTemplate('verificationEmail.html', {
    user_name: userData.name,
    verification_link: CLIENT_URI + '/user/verify?token=' + token,
  });

  const emailData = {
    to: userData.email,
    subject: 'Welcome to Our Service',
    html,
  };
  console.log(emailData);
  try {
    await sendingEmail(emailData);
  } catch (error) {
    throw error;
  }

  return {
    message: `User registered successfully. Please check your email ${userData.email} for verification.`,
    token,
  };
};

const registerUser = async (token: string, deviceInfo?: IDeviceInfo) => {
  const decode = jwt.verify(token, JWT_PROCESS_REGISTRATION_SECRET_KEY) as UserSchema;

  if (!decode) {
    throw NonAuthoritativeInformation('Non Authoritative Information');
  }

  await existUserByEmail(UserModel, decode.email as string);

  const user = await UserModel.create({
    name: decode.name,
    email: decode.email,
    password: decode.password,
  });

  if (!user) {
    throw BadRequestError('User registration failed');
  }

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
  
  if (!accessToken) {
    throw UnauthorizedError('Access token creation failed');
  }

  const refreshToken = generateToken(
    data,
    JWT_REFRESH_SECRET_KEY as string,
    JWT_REFRESH_EXPIRES_IN
  );
  if (!refreshToken) {
    throw UnauthorizedError('Refresh token creation failed');
  }

  return {
    data,
    accessToken,
    refreshToken,
  };
};

const updateUserInfo = async (userData: Partial<UserSchema>) => {
  console.log(userData);
};

export const userService = {
  existUserByEmail,
  processUserRegistration,
  registerUser,
  updateUserInfo,
};
