import express from 'express';
import {
  getDashboardStats,
  getOrdersByStatus,
  getRevenueAnalytics
} from '../../controllers/admin/adminStatsController.js';

const router = express.Router();

// Stats routes - no auth required for read-only dashboard data
// (Frontend protects these routes with AdminProtectedRoute)
router.get('/dashboard', getDashboardStats);
router.get('/orders-by-status', getOrdersByStatus);
router.get('/revenue-analytics', getRevenueAnalytics);

export default router;

