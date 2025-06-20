import { BadRequestError, UnauthorizedError } from '@/app/errors/apiError';
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_PASSWORD_FORGOT_PASSWORD_SECRET,
  JWT_REFRESH_SECRET_KEY,
} from '@/config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateToken = (
  data: Record<string, any>,
  secretKey: string,
  expiresIn: string | any
): string => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Payload must be a non-empty object');
  }

  if (typeof secretKey !== 'string' || secretKey.trim().length === 0) {
    throw new Error('SecretKey must be a non-empty string');
  }
  try {
    const token = jwt.sign(data, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error('Failed to sign in JWT:', error);
    throw error;
  }
};

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY as string);

  if (typeof decoded === 'string') {
    throw UnauthorizedError('Invalid token payload');
  }

  return decoded as JwtPayload;
}

export const forgotPasswordTokenVerifier = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_PASSWORD_FORGOT_PASSWORD_SECRET as string);
    if (typeof decoded === 'string') {
      throw UnauthorizedError('Invalid token payload');
    }
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Error verifying forgot password token:', error);
    throw BadRequestError('Invalid token. Please try again');
  }
};

export function verifyRefreshToken(token: string) {
  const decodedToken = jwt.verify(token, JWT_REFRESH_SECRET_KEY as string);
  if (typeof decodedToken !== 'object' || !(decodedToken as any).user) {
    throw BadRequestError('Invalid refresh token. Please loginIn');
  }
  return { decodedToken };
}
