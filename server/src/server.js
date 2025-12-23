import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient as createRedisClient } from 'redis';
import 'express-async-errors';

import connectDB from './config/db.js';
import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/admin/adminAuthRoutes.js';
import adminMenuRoutes from './routes/admin/adminMenuRoutes.js';
import adminCustomerRoutes from './routes/admin/adminCustomerRoutes.js';
import adminProfileRoutes from './routes/admin/adminProfileRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import deliveryBoyRoutes from './routes/deliveryBoyRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import trackingRoutes from './routes/tracking.routes.js';



import http from 'http';
import { Server } from 'socket.io';
import trackingSocket from './sockets/tracking.socket.js';
import mongoose from 'mongoose';

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
    // Use non-throwing path for disallowed origins
    callback(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Security middleware
app.use(helmet());

// Rate limiting
// WHY: Avoid MemoryStore pressure globally; use Redis store when available; scope to selected routes.
let baseLimiter;
if (process.env.REDIS_URL) {
  try {
    const redisClient = createRedisClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    const store = new RedisStore({
      // express-rate-limit v8 expects sendCommand
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
    baseLimiter = rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
      max: Number(process.env.RATE_LIMIT_MAX || 100),
      standardHeaders: true,
      legacyHeaders: false,
      store,
    });
    console.log('✓ Rate limiter using Redis store');
  } catch (e) {
    console.warn('⚠️  Redis rate-limit store unavailable, falling back to MemoryStore:', e.message);
    baseLimiter = rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
      max: Number(process.env.RATE_LIMIT_MAX || 100),
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
} else {
  baseLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 100),
    standardHeaders: true,
    legacyHeaders: false,
  });
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
// Ensure OPTIONS preflights are handled quickly
app.options('*', cors(corsOptions));

// Request-duration logging for observability (lightweight)
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    if (ms > 500) {
      console.warn('⏱️  Slow request', req.method, req.originalUrl, Math.round(ms) + 'ms', 'status', res.statusCode);
    }
  });
  next();
});

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
// Apply rate limiting only to public/auth routes (exclude tracking)
app.use('/api', routes);
app.use('/api', authRoutes);  // Auth routes already have /auth prefix inside
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/admin/customers', adminCustomerRoutes);
app.use('/api/admin/profile', adminProfileRoutes);
app.use('/api/menu', baseLimiter, menuRoutes);
app.use('/api/payment', baseLimiter, paymentRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/delivery-boys', deliveryBoyRoutes);




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

// Lightweight metrics endpoint (non-sensitive) for runtime observability
app.get('/api/metrics', (req, res) => {
  const mem = process.memoryUsage();
  const clients = req.io ? req.io.engine.clientsCount : undefined;
  const mongooseState = {
    readyState: (mongoose.connection && mongoose.connection.readyState) || undefined,
  };
  res.json({
    success: true,
    data: {
      memory: {
        rss: mem.rss,
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        external: mem.external,
      },
      sockets: { clients },
      mongo: mongooseState,
      timestamp: Date.now(),
    },
  });
});

// Periodic memory usage logging (disabled via env)
if (String(process.env.MEMORY_LOG_ENABLE || '1') === '1') {
  setInterval(() => {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();
    console.debug('🧠 Memory', { rss, heapTotal, heapUsed });
  }, Number(process.env.MEMORY_LOG_INTERVAL_MS || 60000));
}

export default app;
