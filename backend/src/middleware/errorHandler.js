function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal server error',
  };

  if (process.env.NODE_ENV !== 'production' && err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
