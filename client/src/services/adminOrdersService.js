import apiClient from './apiClient.js';

/**
 * Get all single orders (admin)
 * @returns {Array} Array of single orders
 */
export async function getAdminSingleOrders(params = {}) {
  try {
    const query = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 50,
    }).toString();
    const response = await apiClient(`/admin/orders/single?${query}`, {
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
export async function getAdminBulkOrders(params = {}) {
  try {
    const query = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 50,
    }).toString();
    const response = await apiClient(`/admin/orders/bulk?${query}`, {
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
 * Assign delivery partner to an order (admin)
 * @param {String} orderId
 * @param {Object} driver - { name, phone, vehicleNumber }
 */
export async function assignDelivery(orderId, driver) {
  try {
    const response = await apiClient(`/tracking/orders/${orderId}/assign-delivery`, {
      method: 'POST',
      body: JSON.stringify({
        driverName: driver.name,
        driverPhone: driver.phone,
        driverVehicleNumber: driver.vehicleNumber,
      }),
    });
    return response.data || response;
  } catch (error) {
    console.error('Assign delivery error:', error);
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

export async function approveBulkOrder(orderId, pricingData) {
  try {
    const response = await apiClient(`/admin/orders/bulk/${orderId}/approve`, {
      method: 'POST',
      body: JSON.stringify(pricingData),
    });
    return response.data || response;
  } catch (error) {
    console.error('Approve bulk order error:', error);
    throw error;
  }
}

export async function rejectBulkOrder(orderId, reason) {
  try {
    const response = await apiClient(`/admin/orders/bulk/${orderId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.data || response;
  } catch (error) {
    console.error('Reject bulk order error:', error);
    throw error;
  }
}