import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        sessionId: string;
      };
    }
  }
}
