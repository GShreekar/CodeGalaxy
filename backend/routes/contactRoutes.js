import express from 'express';
import { submitContact, contactLimiter } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', contactLimiter, submitContact);

export default router;