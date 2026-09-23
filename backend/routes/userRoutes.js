import express from 'express';
import { getUserDetails, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../schemas/user.js';

const router = express.Router();

router.get('/', protect, getUserDetails);
router.patch('/', protect, validate(updateUserSchema), updateUser);

export default router;