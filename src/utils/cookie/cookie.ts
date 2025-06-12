import { CookieOptions } from 'express';
import { Response } from 'express';

interface ICookieOptions {
  res: Response;
  token: string;
  tokenName: string;
  maxAge: number;
}

export const generateCookie = ({ res, token, tokenName, maxAge }: ICookieOptions): void => {
  try {
    res.cookie(tokenName, token, {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Number(maxAge),
    });
  } catch (error) {
    console.error('Error setting cookie:', error);
    throw new Error('Failed to set cookie');
  }
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  secure: process.env.NODE_ENV === 'production',
};
