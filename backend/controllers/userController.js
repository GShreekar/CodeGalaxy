import { User, Snippet } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { listSnippets } from '../services/snippetService.js';

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

export const getUserBookmarks = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

  res.json(await listSnippets({ filter: { bookmarkedBy: req.user._id }, sort: req.query.sort, page, limit }));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select('name username createdAt');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const [snippetCount, upvoteAgg] = await Promise.all([
    Snippet.countDocuments({ authorId: user._id }),
    Snippet.aggregate([
      { $match: { authorId: user._id } },
      { $group: { _id: null, totalUpvotes: { $sum: { $size: '$upvoters' } } } }
    ])
  ]);

  res.json({
    name: user.name,
    username: user.username,
    joinedAt: user.createdAt,
    snippetCount,
    totalUpvotes: upvoteAgg[0]?.totalUpvotes || 0
  });
});

export const getUserSnippets = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select('_id');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

  res.json(await listSnippets({ filter: { authorId: user._id }, sort: req.query.sort, page, limit }));
});
