import React, { useState } from 'react';
import './MenuItemForm.css';

export default function MenuItemForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    isVeg: true,
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form className="admin-form-container" onSubmit={handleSubmit}>
      {/* Item Name */}
      <div className="admin-form-group">
        <label className="admin-form-label required">Item Name</label>
        <input
          type="text"
          name="itemName"
          className="admin-form-input"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="e.g., Butter Chicken"
          required
        />
      </div>

      {/* Description */}
      <div className="admin-form-group">
        <label className="admin-form-label">Description</label>
        <textarea
          name="description"
          className="admin-form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe this menu item..."
        />
      </div>

      {/* Brand & Category Row */}
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label required">Brand</label>
          <select
            name="brand"
            className="admin-form-select"
            value={formData.brand}
            onChange={handleChange}
            required
          >
            <option value="">Select Brand</option>
            <option value="box8">Box8</option>
            <option value="faasos">Faasos</option>
            <option value="behrouz">Behrouz</option>
            <option value="ovenstory">OvenStory</option>
            <option value="mandarin-oak">Mandarin Oak</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label required">Category</label>
          <select
            name="category"
            className="admin-form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="curries">Curries</option>
            <option value="rice">Rice</option>
            <option value="breads">Breads</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="admin-form-group">
        <label className="admin-form-label required">Price (₹)</label>
        <input
          type="number"
          name="price"
          className="admin-form-input"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., 299"
          step="0.01"
          min="0"
          required
        />
      </div>

      {/* Veg / Non-Veg Toggle */}
      <div className="admin-form-group">
        <div className="admin-form-toggle">
          <span>Vegetarian</span>
          <div className="admin-toggle-switch">
            <input
              type="checkbox"
              name="isVeg"
              id="vegToggle"
              checked={formData.isVeg}
              onChange={handleChange}
            />
            <span className="admin-toggle-slider"></span>
          </div>
        </div>
        <div className="admin-form-help-text">
          {formData.isVeg ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}
        </div>
      </div>

      {/* Status Toggle */}
      <div className="admin-form-group">
        <div className="admin-form-toggle">
          <span>Active</span>
          <div className="admin-toggle-switch">
            <input
              type="checkbox"
              name="isActive"
              id="statusToggle"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span className="admin-toggle-slider"></span>
          </div>
        </div>
        <div className="admin-form-help-text">
          {formData.isActive ? '✓ Available' : '✗ Unavailable'}
        </div>
      </div>

      {/* Form Buttons */}
      <div className="admin-form-buttons">
        <button type="submit" className="admin-btn admin-btn-primary">
          Save Item
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
