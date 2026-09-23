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

// editing your own words is different from moderating someone else's: only
// the comment's author may edit it, but the snippet owner can additionally
// delete any comment on their own snippet (allowSnippetOwner: true)
export const canModifyComment = (allowSnippetOwner) => asyncHandler(async (req, res, next) => {
  const snippet = await Snippet.findById(req.params.id).select('authorId comments');
  if (!snippet) {
    throw new ApiError(404, 'Snippet not found');
  }

  const comment = snippet.comments.id(req.params.commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  const isCommentAuthor = comment.author.equals(req.user._id);
  const isSnippetOwner = allowSnippetOwner && snippet.authorId?.equals(req.user._id);
  if (!isCommentAuthor && !isSnippetOwner) {
    throw new ApiError(403, 'Not your comment');
  }

  req.snippet = snippet;
  req.comment = comment;
  next();
});
