import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { listCustomers, getCustomerDetail } from '../../controllers/admin/adminCustomerController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', listCustomers);
router.get('/:customerId', getCustomerDetail);

export default router;
