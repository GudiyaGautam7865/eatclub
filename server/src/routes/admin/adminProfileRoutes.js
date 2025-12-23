import express from 'express';
import {
  getAdminProfile,
  updateAdminProfile,
  requestEmailChange,
  confirmEmailChange,
  changePassword,
  uploadAdminAvatar,
} from '../../controllers/admin/adminProfileController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminMiddleware } from '../../middleware/adminMiddleware.js';
import uploadAvatar from '../../middleware/uploadAvatar.js';

const router = express.Router();

// All routes require auth + admin middleware
router.use(authMiddleware, adminMiddleware);

router.get('/me', getAdminProfile);
router.put('/me', updateAdminProfile);
router.post('/request-email-change', requestEmailChange);
router.post('/confirm-email-change', confirmEmailChange);
router.post('/change-password', changePassword);
router.post('/avatar', uploadAvatar.single('avatar'), uploadAdminAvatar);

export default router;
