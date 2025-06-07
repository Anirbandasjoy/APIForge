import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  role?: string;
}
