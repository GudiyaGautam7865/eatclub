import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import connectDB from './config/db.js';
import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/admin/adminAuthRoutes.js';
import adminMenuRoutes from './routes/admin/adminMenuRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import trackingRoutes from './routes/tracking.routes.js';



import http from 'http';
import { Server } from 'socket.io';
import trackingSocket from './sockets/tracking.socket.js';

const app = express();

//for tracking socket
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;


//tracking socket setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
});



// Initialize tracking socket
trackingSocket(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API Routes
app.use('/api', trackingRoutes);
app.use('/api', routes);
app.use('/api', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/menu', adminMenuRoutes);



// 🔥 Make socket.io available in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});




// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  });
});

export default app;
