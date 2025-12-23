import express from 'express';
import { createOrder, getUserOrders, cancelOrder } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔴 DEVELOPMENT ONLY: Auth temporarily disabled for testing
// TODO: Re-enable before production
router.use(authMiddleware);

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders/my - Get user's orders
router.get('/my', getUserOrders);

// POST /api/orders/:orderId/cancel - Cancel an order
router.post('/:orderId/cancel', cancelOrder);

export default router;
