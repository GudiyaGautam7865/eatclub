import Order from '../../models/Order.js';
import BulkOrder from '../../models/BulkOrder.js';

/**
 * Get all single orders (admin)
 * GET /api/admin/orders/single
 * @access Private/Admin
 */
export const getAllSingleOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isBulk: false })
      .populate('user', 'name email phoneNumber')
      .populate('driverId', 'name phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get all single orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch single orders',
      error: error.message,
    });
  }
};

/**
 * Get all bulk orders (admin)
 * GET /api/admin/orders/bulk
 * @access Private/Admin
 */
export const getAllBulkOrders = async (req, res) => {
  try {
    if (!BulkOrder || typeof BulkOrder.find !== 'function') {
      console.warn('BulkOrder model not available, returning empty list');
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const bulkOrders = await BulkOrder.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bulkOrders.length,
      data: bulkOrders,
    });
  } catch (error) {
    console.error('Get all bulk orders error:', error.stack || error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bulk orders',
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * Update single order status
 * PATCH /api/admin/orders/:id/status
 * @access Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PLACED', 'PAID', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status,
      deliveryStatus: order.deliveryStatus || null,
      actorId: req.user ? (req.user._id || req.user.id) : undefined,
      actorRole: req.user ? req.user.role : 'ADMIN',
      timestamp: new Date(),
    });

    await order.save();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

/**
 * Update bulk order status
 * PATCH /api/admin/orders/bulk/:id/status
 * @access Private/Admin
 */
export const updateBulkOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const bulkOrder = await BulkOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bulk order status updated successfully',
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Update bulk order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bulk order status',
      error: error.message,
    });
  }
};

/**
 * Get order (single or bulk) by ID
 * GET /api/admin/orders/:id
 * @access Private/Admin
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try single orders first
    let order = await Order.findById(id)
      .populate('user', 'name email phoneNumber')
      .populate('driverId', 'name phoneNumber')
      .lean();
    if (order) {
      return res.status(200).json({ success: true, data: order });
    }

    // Fallback to bulk orders
    const bulkOrder = await BulkOrder.findById(id).lean();
    if (bulkOrder) {
      return res.status(200).json({ success: true, data: bulkOrder });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    console.error('Get order by id error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};
