import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const smtp_username = process.env.SMTP_USERNAME;
const smtp_password = process.env.SMTP_PASSWORD;
const node_env = process.env.NODE_ENV || 'development';
const CLIENT_URI_BASE = process.env.SERVER_URI || 'http://localhost:';
const CLIENT_URI = node_env === 'production' ? CLIENT_URI_BASE : CLIENT_URI_BASE + PORT;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_PROCESS_REGISTRATION_SECRET_KEY =
  process.env.JWT_PROCESS_REGISTRATION_SECRET_KEY || 'dfdfdfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsf';
const JWT_PROCESS_REGISTRATION_EXPIRIES_IN =
  process.env.JWT_PROCESS_REGISTRATION_EXPIRES_IN || '15m';

const JWT_PASSWORD_FORGOT_PASSWORD_SECRET = process.env.JWT_PASSWORD_FORGOT_PASSWORD_SECRET;
const JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN =
  process.env.JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN || '10m';

export {
  PORT,
  MONGO_URI,
  CLIENT_URI,
  smtp_username,
  smtp_password,
  node_env,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_PROCESS_REGISTRATION_SECRET_KEY,
  JWT_PROCESS_REGISTRATION_EXPIRIES_IN,
  JWT_PASSWORD_FORGOT_PASSWORD_SECRET,
  JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN,
};
