import { Schema, model } from 'mongoose';
import { hashPassword } from '@/utils/hash';
import { UserSchema } from './user.schema';

const userSchema = new Schema<UserSchema>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    lastLogin: { type: Date, default: null },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

const UserModel = model<UserSchema>('User', userSchema);

export default UserModel;
