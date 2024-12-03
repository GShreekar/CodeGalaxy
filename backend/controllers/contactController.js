import { Contact } from '../models/index.js';
import rateLimit from 'express-rate-limit';

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many contact requests, please try again later'
});

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, text } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      text
    });

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};