import React, { useState, useEffect } from 'react';
import { adminMenuService } from '../../../services/adminMenuService';
import './MenuItemForm.css';

// Map productId to brandId for database storage
const PRODUCT_BRAND_MAP = {
  'box8': '3',
  'behrouz': 'B1',
  'faasos': 'F1',
  'ovenstory': 'O1',
  'mandarin-oak': 'M1',
  'lunchbox': 'L1',
  'sweet-truth': 'S1',
  'the-good-bowl': 'G1',
  'wow-china': 'W1',
  'wow-momo': 'W2',
  'fresh-menu': 'FR1',
  'firangi-bake': 'FI1',
  'kettle-curry': 'K1',
  'biryani-blues': 'BB1',
};

export default function MenuItemForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    restaurantId: '',
    price: '',
    isVeg: true,
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare FormData for submission
    const selectedRestaurant = restaurants.find(r => r.id === formData.restaurantId);
    const selectedCategory = categories.find(c => c._id === formData.category);

    // Map productId to brandId for database storage
    const brandId = PRODUCT_BRAND_MAP[selectedRestaurant?.id] || selectedRestaurant?.id;

    const submitFormData = new FormData();
    submitFormData.append('brandId', brandId);
    submitFormData.append('brandName', selectedRestaurant?.name);
    submitFormData.append('categoryId', selectedCategory?._id || formData.category);
    submitFormData.append('categoryName', selectedCategory?.name);
    submitFormData.append('name', formData.name);
    submitFormData.append('description', formData.description);
    submitFormData.append('price', parseFloat(formData.price));
    submitFormData.append('isVeg', formData.isVeg);
    
    // Only append image if one was selected
    if (formData.image) {
      submitFormData.append('image', formData.image);
    }

    onSubmit(submitFormData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      restaurantId: '',
      price: '',
      isVeg: true,
      image: null
    });
    setImagePreview(null);
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
              <option key={restaurant.id} value={restaurant.id}>
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
        <label>Image</label>
        <input
          type="file"
          name="image"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Add Menu Item
      </button>
    </form>
  );
}