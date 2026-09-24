import { User, Snippet, SnippetView } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { listSnippets } from '../services/snippetService.js';
import { notifyFollow } from '../services/notificationService.js';

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
  const user = await User.findOne({ username: req.params.username }).select('name username createdAt followers following');
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

  // req.user is only set here when the request carried a valid token
  // (optionalAuth) — an anonymous viewer just never sees isFollowing as true
  const isFollowing = Boolean(req.user) && req.user.following.some((id) => id.equals(user._id));

  res.json({
    name: user.name,
    username: user.username,
    joinedAt: user.createdAt,
    snippetCount,
    totalUpvotes: upvoteAgg[0]?.totalUpvotes || 0,
    followerCount: user.followers.length,
    followingCount: user.following.length,
    isFollowing
  });
});

// toggles the caller following the :username profile; both sides of the
// relationship are denormalised (User.following / User.followers), so both
// documents are updated together
export const toggleFollow = asyncHandler(async (req, res) => {
  const target = await User.findOne({ username: req.params.username }).select('_id');
  if (!target) {
    throw new ApiError(404, 'User not found');
  }
  if (target._id.equals(req.user._id)) {
    throw new ApiError(400, 'You cannot follow yourself');
  }

  const alreadyFollowing = req.user.following.some((id) => id.equals(target._id));

  if (alreadyFollowing) {
    await Promise.all([
      User.updateOne({ _id: req.user._id }, { $pull: { following: target._id } }),
      User.updateOne({ _id: target._id }, { $pull: { followers: req.user._id } })
    ]);
  } else {
    await Promise.all([
      User.updateOne({ _id: req.user._id }, { $addToSet: { following: target._id } }),
      User.updateOne({ _id: target._id }, { $addToSet: { followers: req.user._id } })
    ]);
    await notifyFollow({ followedId: target._id, actor: req.user });
  }

  const updatedTarget = await User.findById(target._id).select('followers');
  res.json({ following: !alreadyFollowing, followerCount: updatedTarget.followers.length });
});

// creator-facing analytics for the logged-in user's own snippets — always
// "me", never another username, so it lives at a fixed path rather than
// under /:username
export const getUserStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const snippetIds = await Snippet.distinct('_id', { authorId: req.user._id });

  const [totals, viewsThisWeek] = await Promise.all([
    Snippet.aggregate([
      { $match: { authorId: req.user._id } },
      { $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalUpvotes: { $sum: { $size: '$upvoters' } },
          snippetCount: { $sum: 1 }
      } }
    ]),
    SnippetView.countDocuments({ snippet: { $in: snippetIds }, createdAt: { $gte: sevenDaysAgo } })
  ]);

  res.json({
    snippetCount: totals[0]?.snippetCount || 0,
    totalViews: totals[0]?.totalViews || 0,
    totalUpvotes: totals[0]?.totalUpvotes || 0,
    viewsThisWeek
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
