import express from 'express';
import {
  getAllSingleOrders,
  getAllBulkOrders,
  updateOrderStatus,
  updateBulkOrderStatus,
  getOrderById,
} from '../../controllers/admin/adminOrderController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
// import { adminMiddleware } from '../../middleware/adminMiddleware.js'; // TEMP: Disabled for testing

const router = express.Router();

// 🔴 DEVELOPMENT ONLY: Admin middleware temporarily disabled for testing
// TODO: Re-enable before production
router.use(authMiddleware);
// router.use(adminMiddleware);

// GET /api/admin/orders/single - Get all single orders
router.get('/single', getAllSingleOrders);

// GET /api/admin/orders/bulk - Get all bulk orders
router.get('/bulk', getAllBulkOrders);

// PATCH /api/admin/orders/bulk/:id/status - Update bulk order status
router.patch('/bulk/:id/status', updateBulkOrderStatus);

// PATCH /api/admin/orders/:id/status - Update single order status
router.patch('/:id/status', updateOrderStatus);

// GET /api/admin/orders/:id - Get a single order (single or bulk)
router.get('/:id', getOrderById);

// (routes rearranged above to ensure static paths match before parameterized routes)

export default router;

