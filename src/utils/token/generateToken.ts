import jwt from 'jsonwebtoken';

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
