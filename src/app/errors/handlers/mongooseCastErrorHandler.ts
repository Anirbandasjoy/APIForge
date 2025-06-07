import mongoose from 'mongoose';

export const handleMongooseCastError = (err: mongoose.Error.CastError) => {
  return {
    statusCode: 400,
    message: `Invalid value for field "${err.path}": ${err.value}`,
    errorDetails: [
      {
        path: err.path,
        message: `Expected a valid ${err.kind} but got ${err.value}`,
      },
    ],
  };
};
