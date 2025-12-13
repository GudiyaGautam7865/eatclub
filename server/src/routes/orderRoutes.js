import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔴 DEVELOPMENT ONLY: Auth temporarily disabled for testing
// TODO: Re-enable before production
router.use(authMiddleware);

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders/my - Get user's orders
router.get('/my', getUserOrders);

export default router;
