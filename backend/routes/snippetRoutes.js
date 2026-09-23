import express from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ownsSnippet, canModifyComment } from '../middleware/ownership.js';
import { createSnippetSchema, updateSnippetSchema, addCommentSchema, updateCommentSchema } from '../schemas/snippet.js';
import {
  getSnippets,
  getSnippetById,
  getRawSnippet,
  createSnippet,
  forkSnippet,
  updateSnippet,
  deleteSnippet,
  upvoteSnippet,
  downvoteSnippet,
  toggleBookmark,
  addComment,
  getSnippetComments,
  updateComment,
  deleteComment,
  getSnippetAuthors,
  getTrendingSnippets,
  getLanguageStats
} from '../controllers/snippetController.js';

const router = express.Router();

// these must be registered before '/:id' or Express would treat
// "authors"/"trending"/"stats" as an :id value
router.get('/authors', getSnippetAuthors);
router.get('/trending', getTrendingSnippets);
router.get('/stats/languages', getLanguageStats);

router.get('/', getSnippets);
router.get('/:id', getSnippetById);
router.get('/:id/raw', getRawSnippet);
router.post('/', protect, validate(createSnippetSchema), createSnippet);
router.post('/:id/fork', protect, forkSnippet);
router.patch('/:id', protect, validate(updateSnippetSchema), ownsSnippet, updateSnippet);
router.delete('/:id', protect, ownsSnippet, deleteSnippet);
router.post('/:id/upvote', protect, upvoteSnippet);
router.post('/:id/downvote', protect, downvoteSnippet);
router.post('/:id/bookmark', protect, toggleBookmark);
router.get('/:id/comments', getSnippetComments);
router.post('/:id/comment', protect, validate(addCommentSchema), addComment);
router.patch('/:id/comment/:commentId', protect, validate(updateCommentSchema), canModifyComment(false), updateComment);
router.delete('/:id/comment/:commentId', protect, canModifyComment(true), deleteComment);

export default router;
