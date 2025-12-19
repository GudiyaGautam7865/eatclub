import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import connectDB from './config/db.js';
import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/admin/adminAuthRoutes.js';
import adminMenuRoutes from './routes/admin/adminMenuRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import trackingRoutes from './routes/tracking.routes.js';



import http from 'http';
import { Server } from 'socket.io';
import trackingSocket from './sockets/tracking.socket.js';

const app = express();

//for tracking socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://eatclub-pfv9.vercel.app').split(',').map(o => o.trim()),
    credentials: true
  }
});

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

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 🔥 Make socket.io available in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api', trackingRoutes);
app.use('/api', routes);
app.use('/api', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/addresses', addressRoutes);




// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Initialize socket tracking
trackingSocket(io);

// Connect to database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  });
});

export default app;
