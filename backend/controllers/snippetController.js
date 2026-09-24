import { Snippet, User, SnippetView } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { listSnippets, FORK_ATTRIBUTION_STAGES } from '../services/snippetService.js';
import { notifyComment, notifyNewSnippet } from '../services/notificationService.js';

const buildSnippetFilter = ({ language, search, author, excludeAuthor, tags }) => {
  const filter = {};

  if (language) {
    filter.language = language;
  }

  if (author) {
    filter.author = author;
  } else if (excludeAuthor) {
    filter.author = { $ne: excludeAuthor };
  }

  if (tags) {
    const tagList = String(tags)
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);
    if (tagList.length) {
      filter.tags = { $in: tagList };
    }
  }

  if (search) {
    filter.$text = { $search: String(search).slice(0, 100) };
  }

  return filter;
};

export const getSnippets = asyncHandler(async (req, res) => {
  const { language, sort, search, author, excludeAuthor, tags } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

  const filter = buildSnippetFilter({ language, search, author, excludeAuthor, tags });
  res.json(await listSnippets({ filter, sort, page, limit }));
});

export const getSnippetById = asyncHandler(async (req, res) => {
  // comments are fetched separately (paginated) via getSnippetComments now
  const snippet = await Snippet.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .select('-comments')
    .populate({ path: 'forkedFrom', select: 'title author' });
  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }
  // logged separately from the all-time counter above so "views this week"
  // can be computed later without needing a scheduled reset job
  await SnippetView.create({ snippet: snippet._id });
  res.json(snippet);
});

export const getRawSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id).select('code');
  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }
  res.type('text/plain').send(snippet.code);
});

export const createSnippet = asyncHandler(async (req, res) => {
  const { title, description, language, code, tags } = req.body;
  const snippet = await Snippet.create({
    author: req.user.username,
    authorId: req.user._id,
    title,
    description,
    language,
    code,
    tags
  });

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { usersnippets: snippet._id } }
  );

  await notifyNewSnippet({ followerIds: req.user.followers, actor: req.user, snippet });

  res.status(201).json(snippet);
});

export const forkSnippet = asyncHandler(async (req, res) => {
  const source = await Snippet.findById(req.params.id)
    .select('title description language code tags');
  if (!source) {
    throw new ApiError(404, 'Snippet not found');
  }

  const fork = await Snippet.create({
    author: req.user.username,
    authorId: req.user._id,
    title: source.title,
    description: source.description,
    language: source.language,
    code: source.code,
    tags: source.tags,
    forkedFrom: source._id
  });

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { usersnippets: fork._id } }
  );

  const populated = await Snippet.findById(fork._id).populate({ path: 'forkedFrom', select: 'title author' });
  res.status(201).json(populated);
});

export const updateSnippet = asyncHandler(async (req, res) => {
  const updated = await Snippet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updated);
});

export const deleteSnippet = asyncHandler(async (req, res) => {
  await Snippet.findOneAndDelete({ _id: req.params.id });
  res.status(204).end();
});

const toggleArrayField = (field, opposite) => asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const setStage = {
    [field]: {
      $cond: [
        { $in: [userId, `$${field}`] },
        { $filter: { input: `$${field}`, cond: { $ne: ['$$this', userId] } } },
        { $concatArrays: [`$${field}`, [userId]] }
      ]
    }
  };
  if (opposite) {
    setStage[opposite] = { $filter: { input: `$${opposite}`, cond: { $ne: ['$$this', userId] } } };
  }

  const updated = await Snippet.findByIdAndUpdate(
    req.params.id,
    [{ $set: setStage }],
    { new: true }
  ).select('-comments');

  if (!updated) {
    throw new ApiError(404, 'Snippet not found');
  }

  res.json(updated);
});

export const upvoteSnippet = toggleArrayField('upvoters', 'downvoters');
export const downvoteSnippet = toggleArrayField('downvoters', 'upvoters');
export const toggleBookmark = toggleArrayField('bookmarkedBy');

export const addComment = asyncHandler(async (req, res) => {
  const comment = {
    text: req.body.text,
    username: req.user.username,
    author: req.user._id
  };

  const snippet = await Snippet.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: comment }, $inc: { commentCount: 1 } },
    { new: true, runValidators: true }
  );

  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }

  await notifyComment({ snippetOwnerId: snippet.authorId, actor: req.user, snippet });

  res.status(201).json(snippet);
});

export const getSnippetComments = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const snippet = await Snippet.findById(req.params.id)
    .select({ comments: { $slice: [skip, limit] }, commentCount: 1 });

  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }

  const total = snippet.commentCount;
  res.json({ items: snippet.comments, page, limit, total, pages: Math.ceil(total / limit) || 1 });
});

export const updateComment = asyncHandler(async (req, res) => {
  const updated = await Snippet.findOneAndUpdate(
    { _id: req.params.id, 'comments._id': req.params.commentId },
    { $set: { 'comments.$.text': req.body.text, 'comments.$.updatedAt': new Date() } },
    { new: true, runValidators: true }
  ).select('comments');

  res.json(updated.comments.id(req.params.commentId));
});

export const deleteComment = asyncHandler(async (req, res) => {
  await Snippet.findByIdAndUpdate(
    req.params.id,
    { $pull: { comments: { _id: req.params.commentId } }, $inc: { commentCount: -1 } }
  );
  res.status(204).end();
});

export const getSnippetAuthors = asyncHandler(async (req, res) => {
  const authors = await Snippet.distinct('author', { author: { $ne: 'CodeGalaxy' } });
  res.json(authors.sort());
});

export const getTrendingSnippets = asyncHandler(async (req, res) => {
  const { language } = req.query;
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 6));

  const match = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  if (language) {
    match.language = language;
  }

  const trending = await Snippet.aggregate([
    { $match: match },
    { $addFields: {
        score: { $subtract: [{ $size: '$upvoters' }, { $size: '$downvoters' }] },
        ageHours: { $divide: [{ $subtract: [new Date(), '$createdAt'] }, 1000 * 60 * 60] }
    } },
    { $addFields: {
        hotness: { $divide: ['$score', { $pow: [{ $add: ['$ageHours', 2] }, 1.5] }] }
    } },
    { $sort: { hotness: -1 } },
    { $limit: limit },
    ...FORK_ATTRIBUTION_STAGES,
    { $project: { comments: 0 } }
  ]);

  res.json(trending);
});

export const getLanguageStats = asyncHandler(async (req, res) => {
  const stats = await Snippet.aggregate([
    {
      $match: {
        language: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$language' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        language: '$_id',
        count: 1,
        _id: 0
      }
    },
    {
      $sort: { language: 1 }
    }
  ]);

  res.json(stats);
});
