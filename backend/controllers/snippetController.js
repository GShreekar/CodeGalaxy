import { Snippet, User } from '../models/index.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  newest: { createdAt: -1 },
  popular: { score: -1, createdAt: -1 }
};

const buildSnippetFilter = ({ language, search, author, excludeAuthor }) => {
  const filter = {};

  if (language) {
    filter.language = language;
  }

  if (author) {
    filter.author = author;
  } else if (excludeAuthor) {
    filter.author = { $ne: excludeAuthor };
  }

  if (search) {
    const safeSearch = escapeRegex(String(search).slice(0, 100));
    filter.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  return filter;
};

export const getSnippets = async (req, res) => {
  try {
    const { language, sort, search, author, excludeAuthor } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const filter = buildSnippetFilter({ language, search, author, excludeAuthor });
    const sortOption = SORTS[sort] || SORTS.newest;

    const [items, total] = await Promise.all([
      Snippet.aggregate([
        { $match: filter },
        { $addFields: {
            score: { $subtract: [{ $size: '$upvoters' }, { $size: '$downvoters' }] }
        } },
        { $sort: sortOption },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { comments: 0 } }
      ]).allowDiskUse(true),
      Snippet.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createSnippet = async (req, res) => {
  try {
    const { title, description, language, code } = req.body;
    const snippet = await Snippet.create({
      author: req.user.username,
      title,
      description,
      language,
      code
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { usersnippets: snippet._id } }
    );

    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// toggles the caller's membership in `field` (and clears it from `opposite`) in a single
// atomic pipeline update, so concurrent votes from different users can never clobber
// each other the way a read-modify-save cycle would
const castVote = (field, opposite) => async (req, res) => {
  try {
    const userId = req.user._id;

    const updated = await Snippet.findByIdAndUpdate(
      req.params.id,
      [
        { $set: {
            [field]: {
              $cond: [
                { $in: [userId, `$${field}`] },
                { $filter: { input: `$${field}`, cond: { $ne: ['$$this', userId] } } },
                { $concatArrays: [`$${field}`, [userId]] }
              ]
            },
            [opposite]: {
              $filter: { input: `$${opposite}`, cond: { $ne: ['$$this', userId] } }
            }
          } }
      ],
      { new: true }
    ).select('-comments');

    if (!updated) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const upvoteSnippet = castVote('upvoters', 'downvoters');
export const downvoteSnippet = castVote('downvoters', 'upvoters');

export const addComment = async (req, res) => {
  try {
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
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSnippetAuthors = async (req, res) => {
  try {
    const authors = await Snippet.distinct('author', { author: { $ne: 'CodeGalaxy' } });
    res.json(authors.sort());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrendingSnippets = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLanguageStats = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error getting language stats:', error);
    res.status(400).json({ message: error.message });
  }
};
