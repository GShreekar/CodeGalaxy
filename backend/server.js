import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';


dotenv.config();

const app = express();

const cors = require('cors');
app.use(cors({ origin: 'https://superb-granita-ff02e0.netlify.app' }));
app.use(express.json());
app.use('/api', apiLimiter);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

import authRoutes from './routes/authRoutes.js';
app.use('/api', authRoutes);
import userRoutes from './routes/userRoutes.js';
app.use('/api/user', userRoutes);
import snippetRoutes from './routes/snippetRoutes.js';
app.use('/api/snippet', snippetRoutes);
import contactRoutes from './routes/contactRoutes.js';
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
