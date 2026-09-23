import { ApiError } from '../utils/ApiError.js';

const normalize = (err) => {
  if (err instanceof ApiError) return err;
  if (err.name === 'CastError') return new ApiError(404, 'Resource not found');
  if (err.name === 'ValidationError') {
    return new ApiError(422, 'Validation failed', Object.values(err.errors).map((e) => e.message));
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return new ApiError(409, `That ${field} is already taken`);
  }
  return err;
};

const errorHandler = (err, req, res, next) => {
  const normalized = normalize(err);
  const status = normalized.status || 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message: normalized.isOperational ? normalized.message : 'Something went wrong',
    ...(normalized.details && { details: normalized.details }),
    // opt-in only: an unset NODE_ENV (the common misconfiguration) must not leak stack traces
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
