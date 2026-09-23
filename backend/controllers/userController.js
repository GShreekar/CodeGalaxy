import { User } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('usersnippets');
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.name = name || user.name;
  user.email = email || user.email;
  const updatedUser = await user.save();

  res.json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email
  });
});
