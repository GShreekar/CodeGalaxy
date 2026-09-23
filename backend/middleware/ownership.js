import { Snippet, Collection } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

// loads the snippet once and verifies the authenticated user owns it, so
// updateSnippet/deleteSnippet never have to re-fetch or re-check ownership
export const ownsSnippet = asyncHandler(async (req, res, next) => {
  const snippet = await Snippet.findById(req.params.id).select('authorId');
  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }
  // a snippet that predates the authorId backfill (or was skipped by the
  // migration because its author string never matched a real user) has no
  // owner at all — treat that as "not yours" rather than crashing on
  // undefined.equals()
  if (!snippet.authorId?.equals(req.user._id)) {
    throw new ApiError(403, 'Not your snippet');
  }
  req.snippet = snippet;
  next();
});

// collections are always private to their owner — this gates every read,
// not just writes
export const ownsCollection = asyncHandler(async (req, res, next) => {
  const collection = await Collection.findById(req.params.id).select('owner');
  if (!collection) {
    throw new ApiError(404, 'Collection not found');
  }
  if (!collection.owner.equals(req.user._id)) {
    throw new ApiError(403, 'Not your collection');
  }
  req.collection = collection;
  next();
});
