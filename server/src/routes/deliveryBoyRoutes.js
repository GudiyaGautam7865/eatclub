import express from 'express';
import {
  createDeliveryBoy,
  getAllDeliveryBoys,
  getDeliveryBoyById,
  updateDeliveryBoyStatus,
  deleteDeliveryBoy,
} from '../controllers/deliveryBoyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (protected)
router.post('/', protect, createDeliveryBoy);
router.get('/', protect, getAllDeliveryBoys);
router.get('/:id', protect, getDeliveryBoyById);
router.patch('/:id/status', protect, updateDeliveryBoyStatus);
router.delete('/:id', protect, deleteDeliveryBoy);

export default router;
