const AppError = require('../utils/AppError');
const { sendError } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return sendError(res, messages.join(', '), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, `Duplicate value for ${field}`, 409);
  }

  if (err.name === 'CastError') {
    return sendError(res, 'Invalid resource ID', 400);
  }

  console.error('Unhandled error:', err);
  return sendError(res, 'Internal server error', 500);
}

module.exports = errorHandler;
