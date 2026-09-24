import express from 'express';
import {
  getUserDetails, updateUser, getUserProfile, getUserSnippets, getUserBookmarks,
  toggleFollow, getUserStats
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../schemas/user.js';

const router = express.Router();

router.get('/', protect, getUserDetails);
router.patch('/', protect, validate(updateUserSchema), updateUser);

// must precede '/:username' or Express would treat these literal segments as a username
router.get('/bookmarks', protect, getUserBookmarks);
router.get('/stats', protect, getUserStats);

// public profile — no auth required, but optionalAuth lets it show
// "Following" state to a logged-in viewer
router.get('/:username/snippets', getUserSnippets);
router.get('/:username', optionalAuth, getUserProfile);
router.post('/:username/follow', protect, toggleFollow);

export default router;
