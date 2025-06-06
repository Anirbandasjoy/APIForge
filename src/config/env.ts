import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const SERVER_URI = process.env.SERVER_URI
  ? process.env.SERVER_URI + PORT
  : `http://localhost:${PORT}`;

export { PORT, MONGO_URI, SERVER_URI };
