import 'express';
import { DeviceInfo } from '@/app/modules/auth/auth.interface';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        sessionId: string;
      };
      deviceInfo?: DeviceInfo;
    }
  }
}
