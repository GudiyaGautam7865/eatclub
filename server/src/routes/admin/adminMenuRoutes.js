import express from 'express';
import { 
  createMenuItem, 
  getAdminMenuItems,
  deleteMenuItem,
  updateMenuItem
} from '../../controllers/admin/adminMenuController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminMiddleware } from '../../middleware/adminMiddleware.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/items', upload.single('image'), createMenuItem);
router.get('/items', getAdminMenuItems);
router.delete('/items/:id', deleteMenuItem);
router.put('/items/:id', upload.single('image'), updateMenuItem);

export default router;
