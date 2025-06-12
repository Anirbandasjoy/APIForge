import crypto from 'crypto';
import { Types } from 'mongoose';
import { IDeviceInfo, SessionModel } from './session.model';
import { expiresRefreshTokenInMs } from '@/app/helper/expiresInMs';

const MAX_SESSIONS = 3;

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

export async function checkAndCreateSession(
  userId: string | Types.ObjectId,
  deviceInfo?: IDeviceInfo
): Promise<{ sessionId?: string; warning?: string }> {
  if (!deviceInfo) {
    throw new Error('Device information is required to create session');
  }

  const sessions = await SessionModel.find({ userId }).sort({ createdAt: 1 });

  const existingSession = sessions.find((session) => {
    return (
      session.deviceInfo?.ip === deviceInfo.ip &&
      session.deviceInfo?.browser === deviceInfo.browser &&
      session.deviceInfo?.os === deviceInfo.os
    );
  });

  if (existingSession) {
    if (typeof expiresRefreshTokenInMs !== 'number') {
      throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
    }

    existingSession.expiresAt = new Date(Date.now() + expiresRefreshTokenInMs);
    await existingSession.save();

    return { sessionId: existingSession.sessionId };
  }

  if (sessions.length >= MAX_SESSIONS) {
    return {
      warning: `You have reached the maximum allowed active sessions (${MAX_SESSIONS}). Please logout from other devices first.`,
    };
  }

  if (typeof expiresRefreshTokenInMs !== 'number') {
    throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
  }

  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + expiresRefreshTokenInMs);

  await SessionModel.create({
    userId,
    sessionId,
    deviceInfo,
    expiresAt,
  });

  return { sessionId };
}
