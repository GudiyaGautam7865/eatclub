import apiClient from './apiClient.js';

export async function getAdminDashboardStats() {
  try {
    const response = await apiClient('/admin/stats/dashboard', { method: 'GET' });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

export async function getOrdersByStatus() {
  try {
    const response = await apiClient('/admin/stats/orders-by-status', { method: 'GET' });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to fetch orders by status:', error);
    throw error;
  }
}

export async function getRevenueAnalytics(period = 'monthly') {
  try {
    const response = await apiClient(`/admin/stats/revenue-analytics?period=${period}`, { method: 'GET' });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to fetch revenue analytics:', error);
    throw error;
  }
}

