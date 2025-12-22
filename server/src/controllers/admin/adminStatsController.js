import Order from '../../models/Order.js';
import User from '../../models/User.js';
import MenuItem from '../../models/MenuItem.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total Orders
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart }
    });

    // Total Revenue
    const totalRevenueResult = await Order.aggregate([
      {
        $match: { status: { $ne: 'CANCELLED' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Today's Revenue
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'CANCELLED' },
          createdAt: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // Total Customers
    const totalCustomers = await User.countDocuments({ role: 'USER' });

    // Active Menu Items
    const activeMenuItems = await MenuItem.countDocuments({ isAvailable: true });

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['PLACED', 'PAID', 'PREPARING'] }
    });

    // Orders this month
    const monthlyOrdersResult = await Order.aggregate([
      {
        $match: { createdAt: { $gte: monthStart } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 }
        }
      }
    ]);
    const monthlyOrders = monthlyOrdersResult[0]?.total || 0;

    // Revenue this month
    const monthlyRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'CANCELLED' },
          createdAt: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Recent Orders (last 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email phone')
      .lean();

    // Best Selling Items
    const bestSellingItems = await Order.aggregate([
      {
        $match: { status: { $ne: 'CANCELLED' } }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.name',
          sales: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } }
        }
      },
      {
        $sort: { sales: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Orders by Status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Weekly Orders Data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const count = await Order.countDocuments({
        createdAt: { $gte: dayStart, $lt: dayEnd }
      });

      const revenue = await Order.aggregate([
        {
          $match: {
            status: { $ne: 'CANCELLED' },
            createdAt: { $gte: dayStart, $lt: dayEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]);

      weeklyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: count,
        revenue: revenue[0]?.total || 0
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalRevenue,
          totalCustomers,
          activeMenuItems,
          pendingOrders,
          todayOrders,
          todayRevenue,
          monthlyOrders,
          monthlyRevenue
        },
        recentOrders: recentOrders.map(order => ({
          id: order._id,
          orderId: order._id.toString().slice(-6).toUpperCase(),
          customer: order.user?.name || 'Unknown',
          amount: order.total,
          status: order.status,
          createdAt: order.createdAt
        })),
        bestSellingItems: bestSellingItems.map(item => ({
          name: item._id,
          sales: item.sales,
          revenue: item.revenue
        })),
        ordersByStatus,
        weeklyData
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req, res) => {
  try {
    const statuses = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders by status',
      error: error.message
    });
  }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query; // daily, weekly, monthly
    const now = new Date();
    let dateRange = {};

    if (period === 'daily') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateRange = { $gte: todayStart };
    } else if (period === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      dateRange = { $gte: weekStart };
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateRange = { $gte: monthStart };
    }

    const data = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'CANCELLED' },
          createdAt: dateRange
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      period,
      data
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analytics',
      error: error.message
    });
  }
};

