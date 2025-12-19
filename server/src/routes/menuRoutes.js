import express from 'express';
import { getMenuByProduct, getProducts, searchMenuItems } from '../controllers/menuController.js';

const router = express.Router();

// Public menu routes
router.get('/products', getProducts);
router.get('/search', searchMenuItems);
router.get('/:productId', getMenuByProduct);

export default router;

