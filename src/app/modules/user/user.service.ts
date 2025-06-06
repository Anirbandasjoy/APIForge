import { createDocument } from '@/app/db/mongoose.helpers';
import UserModel from './user.model';
import { CreateUserInput } from './user.schema';

export const createUser = async (userData: Partial<CreateUserInput>) => {
  return await createDocument(UserModel, userData);
};
