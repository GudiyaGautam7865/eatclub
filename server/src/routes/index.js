import express from 'express';
import orderRoutes from './orderRoutes.js';
import bulkOrderRoutes from './bulkOrderRoutes.js';
import adminOrderRoutes from './admin/adminOrderRoutes.js';

const router = express.Router();

// Mount feature routers here
router.use('/orders', orderRoutes);
router.use('/bulk-orders', bulkOrderRoutes);
router.use('/admin/orders', adminOrderRoutes);

// e.g., router.use('/auth', authRoutes);
// e.g., router.use('/users', userRoutes);
// e.g., router.use('/menu', menuRoutes);

export default router;
