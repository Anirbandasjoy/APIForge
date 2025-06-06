import { createDocument, getDocuments } from '@/app/db/mongoose.helpers';
import UserModel from './user.model';
import { CreateUserInput } from './user.schema';

export const createUser = async (userData: Partial<CreateUserInput>) => {
  return await createDocument(UserModel, userData);
};

export const getUsers = async (query: Record<string, any>, options: any) => {
  return await getDocuments(UserModel, query, options);
};
