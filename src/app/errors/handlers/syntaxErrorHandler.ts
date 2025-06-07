export const handleSyntaxError = (err: SyntaxError) => {
  return {
    statusCode: 400,
    message: 'Invalid JSON payload',
    errorDetails: err.message,
  };
};
