import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    // no origin means a same-origin or non-browser request (e.g. curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true, limit: '256kb' }));
app.use(mongoSanitize());
app.use('/api', apiLimiter);

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import snippetRoutes from './routes/snippetRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/snippet', snippetRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState,
    uptime: process.uptime()
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    ['SIGTERM', 'SIGINT'].forEach((signal) => process.on(signal, () => shutdown(signal)));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
