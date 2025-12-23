import express from 'express';
import {
  createBulkOrder,
  getUserBulkOrders,
  getBulkOrderById,
  cancelBulkOrder,
  proceedToPayment,
} from '../controllers/bulkOrderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, createBulkOrder);
router.get('/my', authMiddleware, getUserBulkOrders);
router.get('/:id', authMiddleware, getBulkOrderById);
router.post('/:id/cancel', authMiddleware, cancelBulkOrder);
router.post('/:id/payment', authMiddleware, proceedToPayment);

export default router;
