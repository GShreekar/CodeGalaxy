import express from 'express';
import { submitContact, contactLimiter } from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';
import { submitContactSchema } from '../schemas/contact.js';

const router = express.Router();

router.post('/', contactLimiter, validate(submitContactSchema), submitContact);

export default router;
