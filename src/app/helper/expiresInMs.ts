import { config } from '@/config/env';
import _ms from 'ms';

const ms = _ms as unknown as (value: string) => number;

export const expiresRefreshTokenInMs = ms(config.JWT_REFRESH_EXPIRES_IN as string);
export const expiresAccessTokenInMs = ms(config.JWT_ACCESS_EXPIRES_IN as string);
