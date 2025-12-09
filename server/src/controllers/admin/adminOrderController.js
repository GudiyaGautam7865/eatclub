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
      .populate('user', 'name email')
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
    const bulkOrders = await BulkOrder.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bulkOrders.length,
      data: bulkOrders,
    });
  } catch (error) {
    console.error('Get all bulk orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bulk orders',
      error: error.message,
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
    const validStatuses = ['PLACED', 'PREPARING', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

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
