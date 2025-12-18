import apiClient from './apiClient.js';
import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

// Prefer a stored admin token; fall back to env-provided dev token when present
const DEV_ADMIN_TOKEN = import.meta.env?.VITE_ADMIN_TOKEN || import.meta.env?.VITE_EATCLUB_ADMIN_TOKEN;

const getAuthHeader = () => {
  const token =
    localStorage.getItem('adminToken') ||
    localStorage.getItem('ec_admin_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('ec_user_token') ||
    DEV_ADMIN_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class AdminMenuService {
  // Fetch all restaurants
  async getRestaurants() {
    const candidates = [
      `${API_URL}/admin/restaurants`,
      `${API_URL}/restaurants`,
      `${API_URL}/admin/restaurant`,
      `${API_URL}/restaurant`
    ];
    for (const url of candidates) {
      try {
        const response = await axios.get(url, { headers: getAuthHeader() });
        const payload = response.data;
        if (Array.isArray(payload)) return payload;
        if (payload?.data && Array.isArray(payload.data)) return payload.data;
        return [];
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error fetching restaurants:', error);
          throw error;
        }
      }
    }
    console.warn('Restaurant endpoint not found in tried routes:', candidates);
    return [];
  }

  // Fetch categories for a specific restaurant
  async getCategories(restaurantId) {
    const candidates = [
      `${API_URL}/admin/categories?restaurant=${restaurantId}`,
      `${API_URL}/categories?restaurant=${restaurantId}`,
      `${API_URL}/admin/category?restaurant=${restaurantId}`,
      `${API_URL}/category?restaurant=${restaurantId}`
    ];
    for (const url of candidates) {
      try {
        const response = await axios.get(url, { headers: getAuthHeader() });
        const payload = response.data;
        if (Array.isArray(payload)) return payload;
        if (payload?.data && Array.isArray(payload.data)) return payload.data;
        return [];
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error fetching categories:', error);
          throw error;
        }
      }
    }
    console.warn('Categories endpoint not found in tried routes:', candidates);
    return [];
  }

  // Add a new menu item (supports FormData for file uploads)
  async addMenuItem(itemData = {}) {
    try {
      // Check if itemData is FormData (has append method)
      if (itemData instanceof FormData) {
        // FormData - send as multipart
        const response = await axios.post(
          `${API_URL}/admin/menu/items`,
          itemData,
          {
            headers: {
              ...getAuthHeader(),
              // DO NOT set Content-Type for FormData; let Axios set it with boundary
            }
          }
        );
        return response.data;
      } else {
        // Plain object - send as JSON
        const payload = {
          brandId: itemData.brandId,
          brandName: itemData.brandName,
          categoryId: itemData.categoryId,
          categoryName: itemData.categoryName,
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          isVeg: itemData.isVeg,
          imageUrl: itemData.imageUrl
        };

        const response = await axios.post(
          `${API_URL}/admin/menu/items`,
          payload,
          { headers: getAuthHeader() }
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  }

  // Fetch all menu items (optionally filtered by restaurant)
  async getMenuItems(restaurantId = null) {
    try {
      const url = restaurantId
        ? `${API_URL}/admin/menu/items?restaurant=${restaurantId}`
        : `${API_URL}/admin/menu/items`;
      
      const response = await axios.get(url, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  // Update a menu item
  async updateMenuItem(itemId, itemData) {
    try {
      if (itemData.imageFile) {
        const formData = new FormData();
        Object.keys(itemData).forEach(key => {
          if (key !== 'imageFile') {
            formData.append(key, itemData[key]);
          }
        });
        formData.append('image', itemData.imageFile);

        const response = await axios.put(
          `${API_URL}/admin/menu/items/${itemId}`,
          formData,
          {
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        return response.data;
      } else {
        const response = await axios.put(
          `${API_URL}/admin/menu/items/${itemId}`,
          itemData,
          { headers: getAuthHeader() }
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  // Delete a menu item
  async deleteMenuItem(itemId) {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/menu/items/${itemId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  // Get list of all brands (restaurants) - synchronous method
  getBrands() {
    // Return empty array for now - this will be populated by getRestaurants() async call
    return [];
  }

  // Load menu items for a specific brand/restaurant
  async loadMenu(brandId, categoryId = null) {
    try {
      // Fetch items filtered by brand (restaurant)
      const items = await this.getMenuItems(brandId);
      
      // Get categories for this brand
      const categories = await this.getCategories(brandId);

      // Filter by category if specified
      const filteredItems = categoryId 
        ? (items?.data || items || []).filter(item => item.categoryId === categoryId)
        : (items?.data || items || []);

      return {
        items: Array.isArray(filteredItems) ? filteredItems : [],
        categories: Array.isArray(categories) ? categories : []
      };
    } catch (error) {
      console.error('Error loading menu:', error);
      return { items: [], categories: [] };
    }
  }

  // Get all menu items across all brands
  async getAllMenuItems() {
    try {
      const items = await this.getMenuItems();
      return items?.data || items || [];
    } catch (error) {
      console.error('Error fetching all menu items:', error);
      return [];
    }
  }
}

export const adminMenuService = new AdminMenuService();





