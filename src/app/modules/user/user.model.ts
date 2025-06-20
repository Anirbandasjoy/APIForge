import { Document, Schema, model } from 'mongoose';
import { hashPassword } from '@/utils/hash';
import { UserSchema } from './user.schema';

export interface IUser extends Document, UserSchema {}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    twoFactor: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null },
      isEnabled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
