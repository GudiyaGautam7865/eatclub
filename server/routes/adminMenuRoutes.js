const express = require('express');
const { getMenuItems, addMenuItem } = require('../controllers/adminMenuController');

const router = express.Router();

// GET /api/admin/menu-items
router.get('/', getMenuItems);

// POST /api/admin/menu-items
router.post('/', addMenuItem);

module.exports = router;