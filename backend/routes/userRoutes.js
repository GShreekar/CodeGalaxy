import express from 'express';
import { getUserDetails, updateUser, getUserProfile, getUserSnippets } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../schemas/user.js';

const router = express.Router();

router.get('/', protect, getUserDetails);
router.patch('/', protect, validate(updateUserSchema), updateUser);

// public profile — no auth required
router.get('/:username/snippets', getUserSnippets);
router.get('/:username', getUserProfile);

export default router;
