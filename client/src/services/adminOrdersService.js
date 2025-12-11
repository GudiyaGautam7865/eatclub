import apiClient from './apiClient.js';

/**
 * Get all single orders (admin)
 * @returns {Array} Array of single orders
 */
export async function getAdminSingleOrders() {
  try {
    const response = await apiClient('/admin/orders/single', {
      method: 'GET',
    });
    return response.data || [];
  } catch (error) {
    console.error('Get admin single orders error:', error);
    throw error;
  }
}

/**
 * Get all bulk orders (admin)
 * @returns {Array} Array of bulk orders
 */
export async function getAdminBulkOrders() {
  try {
    const response = await apiClient('/admin/orders/bulk', {
      method: 'GET',
    });
    return response.data || [];
  } catch (error) {
    console.error('Get admin bulk orders error:', error);
    throw error;
  }
}

/**
 * Update single order status (admin)
 * @param {String} orderId - Order ID
 * @param {String} status - New status
 * @returns {Object} Updated order
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const response = await apiClient(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
}

/**
 * Update bulk order status (admin)
 * @param {String} orderId - Bulk order ID
 * @param {String} status - New status
 * @returns {Object} Updated bulk order
 */
export async function updateBulkOrderStatus(orderId, status) {
  try {
    const response = await apiClient(`/admin/orders/bulk/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  } catch (error) {
    console.error('Update bulk order status error:', error);
    throw error;
  }
}

export default {
  getAdminSingleOrders,
  getAdminBulkOrders,
  updateOrderStatus,
  updateBulkOrderStatus,
};

export async function getAdminOrderById(orderId) {
  try {
    const response = await apiClient(`/admin/orders/${orderId}`, { method: 'GET' });
    return response.data || response;
  } catch (error) {
    console.error('Get admin order by id error:', error);
    throw error;
  }
}
