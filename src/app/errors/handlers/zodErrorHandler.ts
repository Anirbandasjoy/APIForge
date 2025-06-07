import { ZodError } from 'zod';

export const handleZodError = (err: ZodError) => {
  const message = 'Validation Error';
  const errorDetails = err.errors.map((error) => ({
    path: error.path.join('.'),
    message: error.message,
  }));

  return {
    statusCode: 400,
    message,
    errorDetails,
  };
};
