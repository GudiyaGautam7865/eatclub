// Admin Dashboard Stats Service
// Dummy data for now - replace with actual API calls later

export async function getAdminDashboardStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalOrders: 1245,
        totalRevenue: 324750,
        totalCustomers: 832,
        activeMenuItems: 124,
        pendingOrders: 23,
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 849, status: 'pending' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 599, status: 'processing' },
          { id: 'ORD-003', customer: 'Mike Johnson', amount: 1199, status: 'completed' },
        ],
        bestSellingItems: [
          { name: 'Butter Chicken', sales: 245, revenue: 73255 },
          { name: 'Paneer Tikka', sales: 198, revenue: 55242 },
          { name: 'Biryani', sales: 156, revenue: 54444 },
        ],
      });
    }, 500);
  });
}
