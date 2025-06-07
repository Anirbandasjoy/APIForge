import { getDocuments } from '@/app/db/mongoose.helpers';
import UserModel from './user.model';
import { CreateUserInput } from './user.schema';
import { hashPassword } from '@/utils/hash';
import { BadRequestError, ConflictError } from '@/app/errors/apiError';
import { generateToken } from '@/utils/token/generateToken';
import { loadEmailTemplate } from '@/utils/email/loadEmailTemplate';
import { SERVER_URI } from '@/config/env';
import sendingEmail from '@/services/email/emailSender';

export const existUserByEmail = async <T>(
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

export const processUserRegistration = async (userData: Partial<CreateUserInput>) => {
  if (!userData.email || !userData.password || !userData.name) {
    throw BadRequestError('Email, password, and name are required for registration');
  }
  const hashedPassword = await hashPassword(userData.password as string);
  await existUserByEmail(UserModel, userData.email as string);

  const token = generateToken(
    {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      profilePicture: userData.profilePicture,
    },
    process.env.JWT_SECRET_KEY as string,
    '1h'
  );
  if (!token) {
    throw BadRequestError('Failed to generate token for user registration');
  }

  const html = loadEmailTemplate('verificationEmail.html', {
    user_name: userData.name,
    verification_link: SERVER_URI + '/user/verify?token=' + token,
  });

  const emailData = {
    to: userData.email,
    subject: 'Welcome to Our Service',
    html,
  };
  try {
    await sendingEmail(emailData);
  } catch (error) {
    console.error(error);
  }

  return {
    message: `User registered successfully. Please check your email ${userData.email} for verification.`,
  };
};

export const registerUser = async (userData: Partial<CreateUserInput>) => {
  console.log('Registering user with data:', userData);
};

export const getUsers = async (query: Record<string, any>, options: any) => {
  return await getDocuments(UserModel, query, options);
};
