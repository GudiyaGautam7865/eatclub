// API Client for making HTTP requests to the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  // Prefer user token, but allow admin tokens as well so admin endpoints authenticate
  const token =
    localStorage.getItem('ec_user_token') ||
    localStorage.getItem('ec_admin_token') ||
    localStorage.getItem('adminToken') ||
    localStorage.getItem('token');
  return token || null;
};

/**
 * Make an API request
 */
const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
};

export default apiClient;
