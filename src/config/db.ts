import mongoose from 'mongoose';
import { config } from './env';

if (!config.MONGO_URI) {
  throw new Error('Database URL (dbURL) is not defined in the environment variables.');
}
// db connection
const dbConnection = async () => {
  try {
    await mongoose.connect(config.MONGO_URI as string);
    console.log('Database is connected successfully');

    mongoose.connection.on('error', (error: any) => {
      console.error('Database connection error', error.message);
    });
  } catch (error: any) {
    console.error('Initial database connection error', error.message);
  }
};

export default dbConnection;
