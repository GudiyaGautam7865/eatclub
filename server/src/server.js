import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import connectDB from './config/db.js';
import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/admin/adminAuthRoutes.js';
import adminMenuRoutes from './routes/admin/adminMenuRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import trackingRoutes from './routes/tracking.routes.js';



import http from 'http';
import { Server } from 'socket.io';
import trackingSocket from './sockets/tracking.socket.js';

const app = express();

//for tracking socket
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://eatclub-pfv9.vercel.app').split(',').map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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
app.use('/api/payment', paymentRoutes);



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
