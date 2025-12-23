import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminMiddleware } from '../../middleware/adminMiddleware.js';
import { listCustomers, getCustomerDetail } from '../../controllers/admin/adminCustomerController.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', listCustomers);
router.get('/:customerId', getCustomerDetail);

export default router;
