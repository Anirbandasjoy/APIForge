import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const smtp_username = process.env.SMTP_USERNAME;
const smtp_password = process.env.SMTP_PASSWORD;
const node_env = process.env.NODE_ENV || 'development';
const SERVER_URI_BASE = process.env.SERVER_URI || 'http://localhost:';
const SERVER_URI = node_env === 'production' ? SERVER_URI_BASE : SERVER_URI_BASE + PORT;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_PROCESS_REGISTRATION_SECRET_KEY =
  process.env.JWT_PROCESS_REGISTRATION_SECRET_KEY || 'dfdsf';
const JWT_PROCESS_REGISTRATION_EXPIRIES_IN =
  process.env.JWT_PROCESS_REGISTRATION_EXPIRES_IN || '15m';

export {
  PORT,
  MONGO_URI,
  SERVER_URI,
  smtp_username,
  smtp_password,
  node_env,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_PROCESS_REGISTRATION_SECRET_KEY,
  JWT_PROCESS_REGISTRATION_EXPIRIES_IN,
};
