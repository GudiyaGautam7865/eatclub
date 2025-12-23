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

  const isFormData = options && options.body && typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
    // Proactive guard: admin endpoints require admin auth
    if (endpoint.startsWith('/admin/') && !token) {
      try {
        localStorage.setItem('adminAuthError', JSON.stringify({
          message: 'Session expired. Please log in again.',
          status: 401,
          at: Date.now(),
        }));
        // Clear any admin flags/tokens
        localStorage.removeItem('ec_admin_token');
        localStorage.removeItem('isAdminAuthenticated');
      } catch {}

      if (typeof window !== 'undefined' && window.location) {
        setTimeout(() => {
          window.location.replace('/admin/login');
        }, 300);
      }
      const err = new Error('Admin authentication required');
      err.status = 401;
      throw err;
    }

    const response = await fetch(url, config);
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }

    if (!response.ok) {
      const status = response.status;
      const message = (data && data.message) || `Request failed (${status})`;

      // Centralized 401/403 handling for admin UX
      if (status === 401 || status === 403) {
        const authError = {
          message: status === 401 ? 'Session expired. Please log in again.' : 'You do not have permission to access this resource.',
          status,
          at: Date.now(),
        };
        try {
          localStorage.setItem('adminAuthError', JSON.stringify(authError));
          // Clear admin flags/tokens on auth failure
          localStorage.removeItem('ec_admin_token');
          localStorage.removeItem('isAdminAuthenticated');
        } catch {}

        // Redirect to admin login from admin areas or admin API calls
        if (typeof window !== 'undefined' && window.location) {
          const shouldRedirect = window.location.pathname.startsWith('/admin');
          if (shouldRedirect || endpoint.startsWith('/admin/')) {
            setTimeout(() => {
              window.location.replace('/admin/login');
            }, 500);
          }
        }
      }

      const err = new Error(message);
      err.status = status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
};

export default apiClient;
