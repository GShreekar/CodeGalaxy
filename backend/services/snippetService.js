import { Snippet } from '../models/index.js';

const SORTS = {
  newest: { createdAt: -1 },
  popular: { score: -1, createdAt: -1 }
};

// shared by the general snippet listing (getSnippets) and the public
// per-user listing (getUserSnippets) — both are "paginated snippets
// matching a filter", differing only in what the filter is
export const listSnippets = async ({ filter, sort, page, limit }) => {
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

  return { items, page, limit, total, pages: Math.ceil(total / limit) || 1 };
};
