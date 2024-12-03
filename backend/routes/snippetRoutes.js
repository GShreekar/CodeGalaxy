// routes/snippetRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSnippets,
  getSnippetById,
  createSnippet,
  upvoteSnippet,
  downvoteSnippet,
  addComment,
  getAllUserSnippets,
  getLanguageStats
} from '../controllers/snippetController.js';

const router = express.Router();

router.get('/', getSnippets);
router.get('/:id', getSnippetById);
router.post('/', protect, createSnippet);
router.post('/:id/upvote', protect, upvoteSnippet);
router.post('/:id/downvote', protect, downvoteSnippet);
router.post('/:id/comment', protect, addComment);
router.get('/users/all', getAllUserSnippets);
router.get('/stats/languages', getLanguageStats);

export default router;