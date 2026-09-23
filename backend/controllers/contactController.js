import { Contact } from '../models/index.js';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/ApiError.js';

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Too many contact requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, text } = req.body;
  const contact = await Contact.create({ name, email, subject, text });

  res.status(201).json({
    message: 'Contact form submitted successfully',
    contact: {
      id: contact._id,
      name: contact.name,
      subject: contact.subject
    }
  });
});
