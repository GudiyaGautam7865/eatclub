import apiClient from './apiClient.js';

export async function getCustomers({ page = 1, limit = 20, search = '', sortField = 'name', sortDir = 'asc' } = {}) {
  const params = new URLSearchParams({ page, limit, sortField, sortDir });
  if (search) params.append('search', search);
  const response = await apiClient(`/admin/customers?${params.toString()}`, { method: 'GET' });
  return response;
}

export async function getCustomerById(customerId) {
  const response = await apiClient(`/admin/customers/${customerId}`, { method: 'GET' });
  return response.data || response;
}

export async function deleteCustomer(customerId) {
  const response = await apiClient(`/admin/customers/${customerId}`, { method: 'DELETE' });
  return response.data || response;
}
