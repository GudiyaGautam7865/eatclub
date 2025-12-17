import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payment/create-order
router.post('/create-order', createPaymentOrder);

// POST /api/payment/verify
router.post('/verify', verifyPayment);

export default router;
