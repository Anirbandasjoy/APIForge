import http from 'http';
import app from './app';
import dbConnection from './config/db';
import { CLIENT_URI } from './config/env';
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const main = async () => {
  try {
    await dbConnection();

    server.listen(PORT, () => {
      console.log(`Server is running at ${CLIENT_URI}`);
    });
  } catch (error) {
    console.error('Failed to start the server due to a DB connection error', error);
    process.exit(1);
  }
};

main();
