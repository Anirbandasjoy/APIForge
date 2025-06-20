import { BadRequestError, ForbiddenError, UnauthorizedError } from '@/app/errors/apiError';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../user/user.model';
import { UserRole } from '../../constants/userRoles';
import { verifyToken } from '@/utils/token/token';
import { SessionModel } from '../session/session.model';
import { getDeviceInfoFromRequest } from '@/app/helper/getDeviceInfoFromRequest';

export const isAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw UnauthorizedError('Access token missing');
    }

    const data = verifyToken(accessToken);

    if (!data?.user?._id || !data.sessionId) {
      throw UnauthorizedError('Invalid token payload');
    }

    const session = await SessionModel.findOne({ sessionId: data.sessionId });

    if (!session || !session.expiresAt || session.expiresAt < new Date()) {
      throw UnauthorizedError('Session is invalid or expired');
    }

    const currentDeviceInfo = getDeviceInfoFromRequest(req);

    if (
      session.deviceInfo?.ip !== currentDeviceInfo.ip ||
      session.deviceInfo?.browser !== currentDeviceInfo.browser ||
      session.deviceInfo?.os !== currentDeviceInfo.os
    ) {
      throw UnauthorizedError('Device information mismatch. Unauthorized access.');
    }

    req.user = {
      _id: data.user._id,
      sessionId: data.sessionId,
    };
    console.log(`User authenticated: ${req.user._id}, Session ID: ${req.user.sessionId}`);

    next();
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (err) {
    next(UnauthorizedError('Authentication failed'));
  }
};

export const isLogOut = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) return next();

    const decoded = verifyToken(token);
    console.log(decoded);

    if (!decoded?.user?._id || !decoded.sessionId) return next();

    const session = await SessionModel.findOne({ sessionId: decoded.sessionId });

    if (!session || !session.expiresAt || session.expiresAt < new Date()) {
      return next();
    }

    throw BadRequestError('User already logged in');
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next();
    }

    next(error);
  }
};

export const hasRole =
  (...allowedRoles: UserRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user?._id) throw UnauthorizedError('User not authenticated');

      const user = await UserModel.findById(req.user._id, { role: 1 }).lean().exec();

      if (!user) throw UnauthorizedError('User disappeared');

      if (allowedRoles.length && !allowedRoles.includes(user.role as UserRole)) {
        throw ForbiddenError('Access Denied');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
