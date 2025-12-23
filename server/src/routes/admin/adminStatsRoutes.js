import express from 'express';
import {
  getDashboardStats,
  getOrdersByStatus,
  getRevenueAnalytics
} from '../../controllers/admin/adminStatsController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminMiddleware } from '../../middleware/adminMiddleware.js';

const router = express.Router();

// Protect stats routes at API layer as well
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/orders-by-status', getOrdersByStatus);
router.get('/revenue-analytics', getRevenueAnalytics);

export default router;

