import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '@/config/env';
import _ms from 'ms';

const ms = _ms as unknown as (value: string) => number;

export const expiresRefreshTokenInMs = ms(JWT_REFRESH_EXPIRES_IN as string);
export const expiresAccessTokenInMs = ms(JWT_ACCESS_EXPIRES_IN as string);
