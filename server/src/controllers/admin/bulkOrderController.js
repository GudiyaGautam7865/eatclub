import Order from '../../models/Order.js';
import { ORDER_STATUS, ORDER_TYPE } from '../../constants/orderStatus.js';

/**
 * Get all bulk orders (admin)
 * GET /api/admin/bulk-orders
 */
export const getAllBulkOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = { orderType: ORDER_TYPE.BULK };
    
    if (status) {
      query.status = status;
    }

    const bulkOrders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bulkOrders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
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
 * Get bulk order by ID (admin)
 * GET /api/admin/bulk-orders/:id
 */
export const getBulkOrderById = async (req, res) => {
  try {
    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      orderType: ORDER_TYPE.BULK,
    })
      .populate('user', 'name email phone')
      .lean();

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Get bulk order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bulk order',
      error: error.message,
    });
  }
};

/**
 * Accept bulk order and set pricing (admin)
 * POST /api/admin/bulk-orders/:id/accept
 */
export const acceptBulkOrder = async (req, res) => {
  try {
    const {
      finalTotal,
      discount,
      discountReason,
      additionalCharges,
      adminNotes,
    } = req.body;

    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      orderType: ORDER_TYPE.BULK,
    });

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    if (bulkOrder.status !== ORDER_STATUS.REQUESTED) {
      return res.status(400).json({
        success: false,
        message: 'Only requested orders can be accepted',
      });
    }

    bulkOrder.status = ORDER_STATUS.ACCEPTED;
    bulkOrder.total = finalTotal;
    bulkOrder.acceptedAt = new Date();
    bulkOrder.bulkDetails.discount = discount || 0;
    bulkOrder.bulkDetails.discountReason = discountReason;
    bulkOrder.bulkDetails.additionalCharges = additionalCharges || {};
    bulkOrder.bulkDetails.adminNotes = adminNotes;
    
    bulkOrder.statusHistory.push({
      status: ORDER_STATUS.ACCEPTED,
      timestamp: new Date(),
      actorId: req.admin._id,
      actorRole: 'ADMIN',
      note: `Accepted with final price: ₹${finalTotal}`,
    });

    await bulkOrder.save();

    res.status(200).json({
      success: true,
      message: 'Bulk order accepted successfully',
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Accept bulk order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept bulk order',
      error: error.message,
    });
  }
};

/**
 * Reject bulk order (admin)
 * POST /api/admin/bulk-orders/:id/reject
 */
export const rejectBulkOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      orderType: ORDER_TYPE.BULK,
    });

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    if (bulkOrder.status !== ORDER_STATUS.REQUESTED) {
      return res.status(400).json({
        success: false,
        message: 'Only requested orders can be rejected',
      });
    }

    bulkOrder.status = ORDER_STATUS.REJECTED;
    bulkOrder.cancelReason = reason;
    bulkOrder.cancelledBy = 'ADMIN';
    bulkOrder.cancelledAt = new Date();
    
    bulkOrder.statusHistory.push({
      status: ORDER_STATUS.REJECTED,
      timestamp: new Date(),
      actorId: req.admin._id,
      actorRole: 'ADMIN',
      note: reason,
    });

    await bulkOrder.save();

    res.status(200).json({
      success: true,
      message: 'Bulk order rejected successfully',
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Reject bulk order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject bulk order',
      error: error.message,
    });
  }
};

/**
 * Assign delivery boy to bulk order (admin)
 * POST /api/admin/bulk-orders/:id/assign-delivery
 */
export const assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId, deliveryBoyName, deliveryBoyPhone } = req.body;

    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      orderType: ORDER_TYPE.BULK,
    });

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    if (bulkOrder.status !== ORDER_STATUS.PAID && bulkOrder.status !== ORDER_STATUS.SCHEDULED) {
      return res.status(400).json({
        success: false,
        message: 'Order must be paid before assigning delivery',
      });
    }

    bulkOrder.status = ORDER_STATUS.ASSIGNED;
    bulkOrder.bulkDetails.assignedDeliveryBoy = deliveryBoyId;
    bulkOrder.bulkDetails.deliveryBoyName = deliveryBoyName;
    bulkOrder.bulkDetails.deliveryBoyPhone = deliveryBoyPhone;
    bulkOrder.driverId = deliveryBoyId;
    bulkOrder.driverName = deliveryBoyName;
    bulkOrder.driverPhone = deliveryBoyPhone;
    
    bulkOrder.statusHistory.push({
      status: ORDER_STATUS.ASSIGNED,
      timestamp: new Date(),
      actorId: req.admin._id,
      actorRole: 'ADMIN',
      note: `Assigned to ${deliveryBoyName}`,
    });

    await bulkOrder.save();

    res.status(200).json({
      success: true,
      message: 'Delivery boy assigned successfully',
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Assign delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign delivery boy',
      error: error.message,
    });
  }
};

/**
 * Update bulk order status (admin)
 * PATCH /api/admin/bulk-orders/:id/status
 */
export const updateBulkOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      orderType: ORDER_TYPE.BULK,
    });

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    bulkOrder.status = status;
    bulkOrder.statusHistory.push({
      status,
      timestamp: new Date(),
      actorId: req.admin._id,
      actorRole: 'ADMIN',
      note,
    });

    await bulkOrder.save();

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
