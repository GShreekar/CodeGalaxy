import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { contactLimiter } from './controllers/contactController.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', apiLimiter);
app.use('/api/contact', contactLimiter);

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import snippetRoutes from './routes/snippetRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/snippet', snippetRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
