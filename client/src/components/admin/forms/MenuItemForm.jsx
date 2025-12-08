import React, { useState, useEffect } from 'react';
import { adminMenuService } from '../../../services/adminMenuService';
import './MenuItemForm.css';

export default function MenuItemForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    brand: '',
    price: '',
    isVeg: true,
    imageUrl: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [brands] = useState(adminMenuService.getBrands());

  useEffect(() => {
    if (formData.brand) {
      loadCategories();
    }
  }, [formData.brand]);

  const loadCategories = async () => {
    try {
      const cats = await adminMenuService.getCategories(formData.brand);
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
    onSubmit({
      ...formData,
      price: parseFloat(formData.price)
    });
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      brand: '',
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
          <label>Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            disabled={!formData.brand}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
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
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button type="submit" className="submit-btn">
        Add Menu Item
      </button>
    </form>
  );
}