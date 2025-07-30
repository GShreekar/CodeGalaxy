import { Contact } from '../models/index.js';
import rateLimit from 'express-rate-limit';

export const contactLimiter = rateLimit({
  windiwMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Too many contact requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, text } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !text?.trim()) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sanitiedData = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 100),
      subject: subject.trim().slice(0, 200),
      text: text.trim().slice(0, 1000)
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const contact = await Contact.create(sanitizedData);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject
      }
    });
  } catch (error) {
    console.error('Contact submission error: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}