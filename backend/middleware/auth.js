import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized, no token');
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Not authorized, token failed');
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user || user.tokenVersion !== decoded.tokenVersion) {
    throw new ApiError(401, 'Not authorized, session expired');
  }

  req.user = user;
  next();
});

// for public routes that render differently for a logged-in viewer (e.g. a
// profile page showing "Follow" vs "Following") — a missing or invalid token
// just means "treat as anonymous" rather than a 401
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user && user.tokenVersion === decoded.tokenVersion) {
      req.user = user;
    }
  } catch (error) {
    // invalid/expired token on a public route — fall through as anonymous
  }
  next();
});
