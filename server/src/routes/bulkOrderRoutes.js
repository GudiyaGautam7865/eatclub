import express from 'express';
import { createBulkOrder, getUserBulkOrders } from '../controllers/bulkOrderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/bulk-orders - Create bulk order (public)
router.post('/', createBulkOrder);

// GET /api/bulk-orders/my - Get user's bulk orders (protected)
router.get('/my', authMiddleware, getUserBulkOrders);

export default router;
