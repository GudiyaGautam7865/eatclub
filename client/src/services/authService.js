import apiClient from './apiClient.js';

/**
 * User signup
 */
export const signup = async (userData) => {
  const { name, email, password, phoneNumber } = userData;
  
  const response = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
      phoneNumber
    })
  });

  if (response.token && response.user) {
    localStorage.setItem('ec_user_token', response.token);
    localStorage.setItem('ec_user', JSON.stringify(response.user));
  }

  return response;
};

/**
 * User login
 */
export const login = async (credentials) => {
  const { email, password } = credentials;
  
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  });

  if (response.token && response.user) {
    localStorage.setItem('ec_user_token', response.token);
    localStorage.setItem('ec_user', JSON.stringify(response.user));
  }

  return response;
};

/**
 * User logout
 */
export const logout = () => {
  localStorage.removeItem('ec_user_token');
  localStorage.removeItem('ec_user');
};