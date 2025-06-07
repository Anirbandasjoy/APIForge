import { MongoServerError } from 'mongodb';

export const handleDuplicateKeyError = (err: MongoServerError) => {
  const field = Object.keys(err.keyValue)[0];

  return {
    statusCode: 409,
    message: `Duplicate value for field: ${field}`,

    errorDetails: [
      {
        path: field,
        message: `The value '${err.keyValue[field]}' already exists.`,
      },
    ],
  };
};
