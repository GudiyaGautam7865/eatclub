import React, { useState, useEffect } from 'react';
import { adminMenuService } from '../../../services/adminMenuService';
import './MenuItemForm.css';

export default function MenuItemForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    restaurantId: '',
    price: '',
    isVeg: true,
    imageUrl: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (formData.restaurantId) {
      loadCategories();
    }
  }, [formData.restaurantId]);

  const loadRestaurants = async () => {
    try {
      const rests = await adminMenuService.getRestaurants();
      setRestaurants(rests);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await adminMenuService.getCategories(formData.restaurantId);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission with names required by backend
    const selectedRestaurant = restaurants.find(r => r._id === formData.restaurantId);
    const selectedCategory = categories.find(c => c._id === formData.category);

    const DEFAULT_IMAGE_URL = 'https://assets.box8.co.in/rectangle-19x10/xhdpi/product/3810';

    const submitData = {
      brandId: selectedRestaurant?._id || formData.restaurantId,
      brandName: selectedRestaurant?.name,
      categoryId: selectedCategory?._id || formData.category,
      categoryName: selectedCategory?.name,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      isVeg: formData.isVeg,
      imageUrl: formData.imageUrl || DEFAULT_IMAGE_URL
    };

    onSubmit(submitData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      restaurantId: '',
      price: '',
      isVeg: true,
      imageUrl: ''
    });
    setCategories([]);
  };

  return (
    <form className="menu-item-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Restaurant</label>
          <select
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={!formData.restaurantId}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="1"
            required
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isVeg"
              checked={formData.isVeg}
              onChange={handleChange}
            />
            Vegetarian
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Image URL (optional)</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg (defaults if empty)"
        />
      </div>

      <button type="submit" className="submit-btn">
        Add Menu Item
      </button>
    </form>
  );
}