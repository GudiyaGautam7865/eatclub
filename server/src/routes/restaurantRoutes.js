import express from 'express';
import { getRestaurants, getCategories } from '../controllers/restaurantController.js';

const router = express.Router();

// Public endpoints to fetch restaurants and their categories
router.get('/restaurants', getRestaurants);
router.get('/categories', getCategories);

// Admin-friendly aliases to satisfy existing client calls
router.get('/admin/restaurants', getRestaurants);
router.get('/admin/categories', getCategories);

export default router;
