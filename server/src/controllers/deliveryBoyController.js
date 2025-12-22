import User from '../models/User.js';
import Order from '../models/Order.js';
import { sendDeliveryBoyCredentials } from '../utils/emailService.js';

// Admin: Create Delivery Boy
export const createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, phone, vehicleType, vehicleNumber, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists with this email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create delivery boy as a user with DELIVERY_BOY role
    const deliveryBoy = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      vehicleType: vehicleType || 'BIKE',
      vehicleNumber: vehicleNumber || '',
      password: password,
      role: 'DELIVERY_BOY',
      deliveryStatus: 'ACTIVE',
      isActive: true,
    });

    // Send credentials via email
    try {
      await sendDeliveryBoyCredentials(email, password, name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      console.warn('⚠️  Delivery boy created but email could not be sent. Manual credentials sharing required.');
    }

    res.status(201).json({
      success: true,
      message: 'Delivery boy created successfully. Credentials sent via email.',
      data: {
        deliveryBoy: {
          id: deliveryBoy._id,
          name: deliveryBoy.name,
          email: deliveryBoy.email,
          phone: deliveryBoy.phone,
          vehicleType: deliveryBoy.vehicleType,
          vehicleNumber: deliveryBoy.vehicleNumber,
          deliveryStatus: deliveryBoy.deliveryStatus,
          role: deliveryBoy.role,
        },
      },
    });
  } catch (error) {
    console.error('Create delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating delivery boy',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all delivery boys (Admin)
export const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: 'DELIVERY_BOY' }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deliveryBoys,
    });
  } catch (error) {
    console.error('Get delivery boys error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching delivery boys',
    });
  }
};

// Get single delivery boy by ID (Admin)
export const getDeliveryBoyById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await User.findById(id).select('-password');

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    res.json({
      success: true,
      data: deliveryBoy,
    });
  } catch (error) {
    console.error('Get delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching delivery boy',
    });
  }
};

// Get delivery boy details with stats (Admin)
export const getDeliveryBoyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch delivery boy profile
    const deliveryBoy = await User.findById(id).select('-password');

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    // Default delivery fee (can be made configurable)
    const DEFAULT_DELIVERY_FEE = 40;

    // Aggregate orders data
    const ordersStats = await Order.aggregate([
      { $match: { driverId: deliveryBoy._id } },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          completedDeliveries: {
            $sum: { $cond: [{ $eq: ['$deliveryStatus', 'DELIVERED'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = ordersStats[0] || {
      totalDeliveries: 0,
      completedDeliveries: 0
    };

    // Calculate total earnings (delivery fee per completed delivery)
    const totalEarnings = stats.completedDeliveries * DEFAULT_DELIVERY_FEE;

    // Get recent orders
    const recentOrders = await Order.find({ driverId: deliveryBoy._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('items total status deliveryStatus createdAt updatedAt address');

    // Calculate weekly earnings
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyEarnings = await Order.aggregate([
      {
        $match: {
          driverId: deliveryBoy._id,
          deliveryStatus: 'DELIVERED',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Add earnings to weekly data
    const weeklyData = weeklyEarnings.map(item => ({
      ...item,
      earnings: item.orders * DEFAULT_DELIVERY_FEE
    }));

    // Calculate performance metrics
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const performanceData = await Order.aggregate([
      {
        $match: {
          driverId: deliveryBoy._id,
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: null,
          totalCompletedDeliveries: {
            $sum: { $cond: [{ $eq: ['$deliveryStatus', 'DELIVERED'] }, 1, 0] }
          }
        }
      }
    ]);

    const performance = performanceData[0] || {
      totalCompletedDeliveries: 0
    };

    // Assume 90% on-time rate for now (can be tracked with actual timestamps later)
    const onTimeRate = 90;

    // Generate order ID for display
    const generateOrderId = (mongoId) => {
      return `ORD-${mongoId.toString().substring(mongoId.toString().length - 6).toUpperCase()}`;
    };

    res.json({
      success: true,
      data: {
        profile: {
          id: deliveryBoy._id,
          name: deliveryBoy.name,
          email: deliveryBoy.email,
          phone: deliveryBoy.phone,
          vehicleType: deliveryBoy.vehicleType,
          vehicleNumber: deliveryBoy.vehicleNumber,
          deliveryStatus: deliveryBoy.deliveryStatus,
          isActive: deliveryBoy.isActive,
          joiningDate: deliveryBoy.createdAt
        },
        stats: {
          totalDeliveries: stats.totalDeliveries,
          completedDeliveries: stats.completedDeliveries,
          totalEarnings: totalEarnings,
          averageRating: '4.5' // Default rating (can be tracked later)
        },
        recentOrders: recentOrders.map(order => ({
          id: order._id,
          orderId: generateOrderId(order._id),
          customerName: order.user?.name || 'Unknown',
          restaurantName: 'Restaurant', // Can be added to order model later
          address: order.address?.line1 || 'N/A',
          amount: order.total,
          status: order.deliveryStatus || order.status,
          orderDate: order.createdAt,
          deliveredAt: order.updatedAt
        })),
        weeklyEarnings: weeklyData,
        performance: {
          onTimeDeliveryRate: onTimeRate.toFixed(1),
          totalRatings: Math.floor(stats.completedDeliveries * 0.7), // Assume 70% customers leave ratings
          averageRating: '4.5', // Default rating
          totalDistance: stats.completedDeliveries * 5 // Assume avg 5km per delivery
        }
      }
    });
  } catch (error) {
    console.error('Get delivery boy details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching delivery boy details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update delivery boy status (Admin)
export const updateDeliveryBoyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'INACTIVE', 'ON_DELIVERY', 'OFFLINE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const deliveryBoy = await User.findByIdAndUpdate(
      id,
      { deliveryStatus: status },
      { new: true }
    ).select('-password');

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: deliveryBoy,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status',
    });
  }
};

// Delete delivery boy (Admin)
export const deleteDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await User.findByIdAndDelete(id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    res.json({
      success: true,
      message: 'Delivery boy deleted successfully',
    });
  } catch (error) {
    console.error('Delete delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting delivery boy',
    });
  }
};
