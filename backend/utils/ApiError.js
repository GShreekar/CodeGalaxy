// a thrown ApiError carries the HTTP status and public message the central
// errorHandler should send back; anything else thrown is treated as an
// unexpected 500 and never shown to the client verbatim
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.isOperational = true;
  }
}

// Express 4 does not catch rejected promises from async handlers, so every
// async route/middleware must be wrapped in this to forward errors to next()
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
