import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const smtp_username = process.env.SMTP_USERNAME;
const smtp_password = process.env.SMTP_PASSWORD;
const node_env = process.env.NODE_ENV || 'development';
const SERVER_URI_BASE = process.env.SERVER_URI || 'http://localhost:';
const SERVER_URI = node_env === 'production' ? SERVER_URI_BASE : SERVER_URI_BASE + PORT;

export { PORT, MONGO_URI, SERVER_URI, smtp_username, smtp_password, node_env };
