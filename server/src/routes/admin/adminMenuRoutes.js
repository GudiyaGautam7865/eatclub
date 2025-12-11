import express from 'express';
import { 
  createMenuItem, 
  getAdminMenuItems,
  deleteMenuItem,
  updateMenuItem   // <-- add this
} from '../../controllers/admin/adminMenuController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminMiddleware } from '../../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/items', createMenuItem);
router.get('/items', getAdminMenuItems);
router.delete('/items/:id', deleteMenuItem);
router.put('/items/:id', updateMenuItem); // <-- new route

export default router;
