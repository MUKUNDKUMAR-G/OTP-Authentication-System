/**
 * Main server file
 * Sets up Express app with CORS, middleware, and routes
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './authController.js';
import { errorHandler, notFoundHandler } from './middleware.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Get port from environment or use default
const PORT = process.env.PORT || 3001;

// Configure CORS middleware for frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Mount authentication routes
app.use('/auth', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Not found handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
