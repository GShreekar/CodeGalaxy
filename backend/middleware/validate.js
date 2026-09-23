import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new ApiError(422, 'Validation failed',
      result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)));
  }
  req.body = result.data;
  next();
};
