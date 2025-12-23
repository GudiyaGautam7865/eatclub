import apiClient from './apiClient.js';

/**
 * Create a new bulk order request
 */
export async function createBulkOrder(orderData) {
  try {
    const response = await apiClient('/bulk-orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  } catch (error) {
    console.error('Create bulk order error:', error);
    throw error;
  }
}

/**
 * Get user's bulk orders
 */
export async function getUserBulkOrders() {
  try {
    const response = await apiClient('/bulk-orders/my', {
      method: 'GET',
    });
    return response.data || [];
  } catch (error) {
    console.error('Get bulk orders error:', error);
    throw error;
  }
}

/**
 * Get bulk order by ID
 */
export async function getBulkOrderById(orderId) {
  try {
    const response = await apiClient(`/bulk-orders/${orderId}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Get bulk order by ID error:', error);
    throw error;
  }
}

/**
 * Cancel bulk order
 */
export async function cancelBulkOrder(orderId, cancelReason) {
  try {
    const response = await apiClient(`/bulk-orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancelReason }),
    });
    return response.data;
  } catch (error) {
    console.error('Cancel bulk order error:', error);
    throw error;
  }
}

/**
 * Proceed to payment for bulk order
 */
export async function proceedToBulkPayment(orderId) {
  try {
    const response = await apiClient(`/bulk-orders/${orderId}/payment`, {
      method: 'POST',
    });
    return response.data;
  } catch (error) {
    console.error('Proceed to payment error:', error);
    throw error;
  }
}

// Admin functions
export async function getAdminBulkOrders(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient(`/admin/bulk-orders?${query}`, {
      method: 'GET',
    });
    return response.data || [];
  } catch (error) {
    console.error('Get admin bulk orders error:', error);
    throw error;
  }
}

export async function getAdminBulkOrderById(orderId) {
  try {
    const response = await apiClient(`/admin/bulk-orders/${orderId}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Get admin bulk order by ID error:', error);
    throw error;
  }
}

export async function acceptBulkOrder(orderId, pricingData) {
  try {
    const response = await apiClient(`/admin/bulk-orders/${orderId}/accept`, {
      method: 'POST',
      body: JSON.stringify(pricingData),
    });
    return response.data;
  } catch (error) {
    console.error('Accept bulk order error:', error);
    throw error;
  }
}

export async function rejectBulkOrder(orderId, reason) {
  try {
    const response = await apiClient(`/admin/bulk-orders/${orderId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.data;
  } catch (error) {
    console.error('Reject bulk order error:', error);
    throw error;
  }
}

export async function assignDeliveryToBulkOrder(orderId, deliveryData) {
  try {
    const response = await apiClient(`/admin/bulk-orders/${orderId}/assign-delivery`, {
      method: 'POST',
      body: JSON.stringify(deliveryData),
    });
    return response.data;
  } catch (error) {
    console.error('Assign delivery error:', error);
    throw error;
  }
}

export async function updateBulkOrderStatus(orderId, status, note) {
  try {
    const response = await apiClient(`/admin/bulk-orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
    return response.data;
  } catch (error) {
    console.error('Update bulk order status error:', error);
    throw error;
  }
}

export default {
  createBulkOrder,
  getUserBulkOrders,
  getBulkOrderById,
  cancelBulkOrder,
  proceedToBulkPayment,
  getAdminBulkOrders,
  getAdminBulkOrderById,
  acceptBulkOrder,
  rejectBulkOrder,
  assignDeliveryToBulkOrder,
  updateBulkOrderStatus,
};
