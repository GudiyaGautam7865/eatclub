import express from 'express';
import { createMenuItem, getAdminMenuItems } from '../../controllers/admin/adminMenuController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminMiddleware } from '../../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// POST /api/admin/menu/items - Create new menu item
router.post('/items', createMenuItem);

// GET /api/admin/menu/items - Get all menu items (with filters)
router.get('/items', getAdminMenuItems);

export default router;
