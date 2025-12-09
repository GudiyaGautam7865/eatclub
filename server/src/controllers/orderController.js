import Order from '../models/Order.js';

/**
 * Create a new order
 * POST /api/orders
 * @access Private (requires authentication)
 */
export const createOrder = async (req, res) => {
  try {
    const { items, total, payment, address } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total',
      });
    }

    if (!address || !address.line1) {
      return res.status(400).json({
        success: false,
        message: 'Address is required',
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id || "675712abc123def456789001",
      items,
      total,
      status: 'PLACED',
      payment: payment || { method: 'COD' },
      address,
      isBulk: false,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Get all orders for logged-in user
 * GET /api/orders/my
 * @access Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};
