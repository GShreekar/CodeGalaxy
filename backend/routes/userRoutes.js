import express from 'express';
import { createUser, getUserDetails, updateUser, getCurrentUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', protect, getUserDetails);
router.patch('/', protect, updateUser);
router.get('/', protect, getCurrentUser);

export default router;