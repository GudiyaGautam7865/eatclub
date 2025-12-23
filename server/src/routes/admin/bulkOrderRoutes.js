import express from 'express';
import {
  getAllBulkOrders,
  getBulkOrderById,
  acceptBulkOrder,
  rejectBulkOrder,
  assignDeliveryBoy,
  updateBulkOrderStatus,
} from '../../controllers/admin/bulkOrderController.js';

const router = express.Router();

router.get('/', getAllBulkOrders);
router.get('/:id', getBulkOrderById);
router.post('/:id/accept', acceptBulkOrder);
router.post('/:id/reject', rejectBulkOrder);
router.post('/:id/assign-delivery', assignDeliveryBoy);
router.patch('/:id/status', updateBulkOrderStatus);

export default router;
