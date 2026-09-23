import { Snippet } from '../models/index.js';
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
