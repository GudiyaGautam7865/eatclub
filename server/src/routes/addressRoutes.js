
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { listAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', listAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;

