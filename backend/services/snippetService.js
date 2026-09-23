import { Snippet } from '../models/index.js';

const SORTS = {
  newest: { createdAt: -1 },
  popular: { score: -1, createdAt: -1 }
};

// shared by the general snippet listing (getSnippets) and the public
// per-user listing (getUserSnippets) — both are "paginated snippets
// matching a filter", differing only in what the filter is
export const listSnippets = async ({ filter, sort, page, limit }) => {
  // $meta: 'textScore' throws if the query has no $text match — never add it
  // unless we know filter carries one
  const isTextSearch = Boolean(filter.$text);

  const sortOption = isTextSearch && !sort
    ? { textScore: { $meta: 'textScore' } }
    : SORTS[sort] || SORTS.newest;

  const addFields = {
    score: { $subtract: [{ $size: '$upvoters' }, { $size: '$downvoters' }] }
  };
  if (isTextSearch) {
    addFields.textScore = { $meta: 'textScore' };
  }

  const [items, total] = await Promise.all([
    Snippet.aggregate([
      { $match: filter },
      { $addFields: addFields },
      { $sort: sortOption },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { comments: 0 } }
    ]).allowDiskUse(true),
    Snippet.countDocuments(filter)
  ]);

  return { items, page, limit, total, pages: Math.ceil(total / limit) || 1 };
};
