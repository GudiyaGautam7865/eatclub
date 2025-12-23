// Admin Authentication Service (Frontend Only - No Backend Calls)
import apiClient from './apiClient.js';

const ADMIN_AUTH_KEY = 'isAdminAuthenticated';

/**
 * Login with backend authentication
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} { success: boolean, message?: string, data?: object }
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      // Store token and admin data
      localStorage.setItem('ec_admin_token', response.data.token);
      localStorage.setItem('ec_user', JSON.stringify(response.data.admin));
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      localStorage.setItem('adminLoginTime', new Date().toISOString());
      
      return { success: true, data: response.data };
    }

    return {
      success: false,
      message: response.message || 'Login failed',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Invalid credentials',
    };
  }
};

/**
 * Logout admin user
 */
export const logout = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem('adminLoginTime');
  localStorage.removeItem('ec_admin_token');
  localStorage.removeItem('ec_user');
};

/**
 * Check if admin is authenticated
 * @returns {boolean}
 */
export const isAdminAuthenticated = () => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

/**
 * Get admin last login time
 * @returns {string|null}
 */
export const getAdminLoginTime = () => {
  return localStorage.getItem('adminLoginTime');
};

// Export as default object for easier imports
export const adminAuthService = {
  login,
  logout,
  isAdminAuthenticated,
  getAdminLoginTime,
};

export default adminAuthService;
