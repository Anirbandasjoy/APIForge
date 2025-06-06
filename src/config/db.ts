import mongoose from 'mongoose';
import { MONGO_URI } from './env';

if (!MONGO_URI) {
  throw new Error('Database URL (dbURL) is not defined in the environment variables.');
}
// db connection
const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('Database is connected successfully');

    mongoose.connection.on('error', (error: any) => {
      console.error('Database connection error', error.message);
    });
  } catch (error: any) {
    console.error('Initial database connection error', error.message);
  }
};

export default dbConnection;
