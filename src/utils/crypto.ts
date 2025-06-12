import crypto from 'crypto';

export const generateSessionId = () => {
  return crypto.randomBytes(16).toString('hex');
};
