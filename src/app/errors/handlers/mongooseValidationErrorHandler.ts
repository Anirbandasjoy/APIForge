import { Error as MongooseError } from 'mongoose';

export const handleMongooseValidationError = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => ({
    path: el.path,
    message: el.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorDetails: errors,
  };
};
