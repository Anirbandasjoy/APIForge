import { BadRequestError, NotFoundError } from '@/app/errors/apiError';

export const findById = async <T>(
  model: any,
  id: string,
  options: Record<string, any> = {}
): Promise<T | null> => {
  try {
    if (!id) {
      throw new Error('ID is required to find a document');
    }
    const query = { _id: id };
    const item = await model.findOne(query, options).lean().exec();
    if (!item) {
      throw NotFoundError(`Item with ID ${id} not found`);
    }
    return item;
  } catch (error) {
    console.error('Error finding item by ID:', error);
    throw error;
  }
};

export const findByEmail = async <T>(
  model: any,
  email: string,
  options: Record<string, any> = {}
): Promise<T | null> => {
  try {
    if (!email) {
      throw BadRequestError('Email is required to find a document');
    }

    const query = { email };
    const item = await model.findOne(query, options).lean().exec();
    if (!item) {
      throw NotFoundError(`Item with email ${email} not found`);
    }
    return item;
  } catch (error) {
    console.error('Error finding item by email:', error);
    throw error;
  }
};
