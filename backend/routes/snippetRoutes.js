import express from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSnippetSchema, addCommentSchema } from '../schemas/snippet.js';
import {
  getSnippets,
  getSnippetById,
  createSnippet,
  upvoteSnippet,
  downvoteSnippet,
  addComment,
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
router.post('/', protect, validate(createSnippetSchema), createSnippet);
router.post('/:id/upvote', protect, upvoteSnippet);
router.post('/:id/downvote', protect, downvoteSnippet);
router.post('/:id/comment', protect, validate(addCommentSchema), addComment);

export default router;
