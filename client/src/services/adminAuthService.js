// Admin Authentication Service (Frontend Only - No Backend Calls)

const ADMIN_AUTH_KEY = 'isAdminAuthenticated';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '1260',
};

/**
 * Login with hard-coded credentials
 * @param {string} username 
 * @param {string} password 
 * @returns {Object} { success: boolean, message?: string }
 */
export const login = (username, password) => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    localStorage.setItem('adminLoginTime', new Date().toISOString());
    return { success: true };
  }
  
  return { 
    success: false, 
    message: 'Invalid username or password' 
  };
};

/**
 * Logout admin user
 */
export const logout = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem('adminLoginTime');
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
