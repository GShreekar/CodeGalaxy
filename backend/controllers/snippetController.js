import { Snippet, User } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { listSnippets } from '../services/snippetService.js';

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

  // uses the weighted text index (title, description, code) instead of a
  // regex scan — matches code bodies, does stemming, and needs no escaping
  // since it isn't user-supplied regex
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
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }
  res.json(snippet);
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

  res.status(201).json(snippet);
});

// ownership is already verified by the ownsSnippet middleware, which also
// loaded the snippet once — no need to re-fetch or re-check here
export const updateSnippet = asyncHandler(async (req, res) => {
  const updated = await Snippet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updated);
});

export const deleteSnippet = asyncHandler(async (req, res) => {
  // triggers the post('findOneAndDelete') hook that pulls this snippet out
  // of the owning User's usersnippets array
  await Snippet.findOneAndDelete({ _id: req.params.id });
  res.status(204).end();
});

// toggles the caller's membership in `field` (clearing `opposite`, if given) in a single
// atomic pipeline update, so concurrent votes/bookmarks from different users can never
// clobber each other the way a read-modify-save cycle would
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

  res.status(201).json(snippet);
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
