import apiClient from './apiClient.js';

/**
 * Get all delivery boys
 */
export const getAllDeliveryBoys = async () => {
  const response = await apiClient('/delivery-boys', {
    method: 'GET',
  });
  return response.data;
};

/**
 * Get single delivery boy by ID
 */
export const getDeliveryBoyById = async (id) => {
  const response = await apiClient(`/delivery-boys/${id}`, {
    method: 'GET',
  });
  return response.data;
};

/**
 * Create new delivery boy
 */
export const createDeliveryBoy = async (data) => {
  const response = await apiClient('/delivery-boys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

/**
 * Update delivery boy status
 */
export const updateDeliveryBoyStatus = async (id, status) => {
  const response = await apiClient(`/delivery-boys/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return response.data;
};

/**
 * Delete delivery boy
 */
export const deleteDeliveryBoy = async (id) => {
  const response = await apiClient(`/delivery-boys/${id}`, {
    method: 'DELETE',
  });
  return response;
};
