import apiClient from './apiClient';

// Delivery Partner Authentication
export const deliveryLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/delivery/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deliveryLogout = async () => {
  try {
    const response = await apiClient.post('/delivery/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delivery Partner Profile
export const getDeliveryPartnerProfile = async () => {
  try {
    const response = await apiClient.get('/delivery/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDeliveryPartnerProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/delivery/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Online/Offline Status
export const updateOnlineStatus = async (isOnline) => {
  try {
    const response = await apiClient.patch('/delivery/status', { isOnline });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Orders Management
export const getDeliveryOrders = async (status = 'all') => {
  try {
    const response = await apiClient.get(`/delivery/orders?status=${status}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/delivery/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/delivery/orders/${orderId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const rejectOrder = async (orderId, reason) => {
  try {
    const response = await apiClient.patch(`/delivery/orders/${orderId}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (orderId, status, location = null) => {
  try {
    const response = await apiClient.patch(`/delivery/orders/${orderId}/status`, {
      status,
      location
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Earnings
export const getEarnings = async (period = 'today') => {
  try {
    const response = await apiClient.get(`/delivery/earnings?period=${period}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getEarningsHistory = async (startDate, endDate) => {
  try {
    const response = await apiClient.get('/delivery/earnings/history', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/delivery/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Location Updates
export const updateLocation = async (latitude, longitude) => {
  try {
    const response = await apiClient.patch('/delivery/location', {
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Support
export const contactSupport = async (message, orderId = null) => {
  try {
    const response = await apiClient.post('/delivery/support', {
      message,
      orderId,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};