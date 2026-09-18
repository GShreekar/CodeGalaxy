import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', protect, logoutUser);

export default router;