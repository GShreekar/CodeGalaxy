import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

const TOKEN_EXPIRY = '7d';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(409, 'A user with this email or username already exists. Please try a different email or username.');
  }

  // password is hashed by the User model's pre('save') hook
  const user = await User.create({ name, username, email, password });

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    token: signToken(user)
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const isMatch = user ? await bcrypt.compare(password, user.password) : false;
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    token: signToken(user)
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  req.user.tokenVersion += 1;
  await req.user.save();
  res.json({ message: 'Logged out' });
});
