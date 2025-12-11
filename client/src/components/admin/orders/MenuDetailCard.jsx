import React, { useState } from 'react';
import './MenuDetailCard.css';

export default function MenuDetailCard({ menuItem, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(menuItem);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="menu-detail-card">
      <div className="menu-detail-header">
        <h1>Menu Item Details</h1>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : '✏️ Edit'}
        </button>
      </div>

      {!isEditing ? (
        <div className="menu-detail-view">
          <div className="menu-image">
            <img src={formData.imageUrl} alt={formData.name} />
            <span className={`veg-badge ${formData.isVeg ? 'veg' : 'non-veg'}`}>
              {formData.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
            </span>
          </div>

          <div className="menu-info">
            <h2>{formData.name}</h2>
            <p className="menu-description">{formData.description}</p>

            <div className="menu-pricing">
              <div className="price-item">
                <span className="price-label">Regular Price:</span>
                <span className="price-value">₹{formData.price}</span>
              </div>
              <div className="price-item">
                <span className="price-label">Membership Price:</span>
                <span className="price-value membership">₹{formData.membershipPrice}</span>
              </div>
            </div>

            <div className="menu-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{formData.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Restaurant:</span>
                <span className="meta-value">{formData.restaurant}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`availability-badge ${formData.isAvailable ? 'available' : 'unavailable'}`}>
                  {formData.isAvailable ? '✅ Available' : '❌ Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="menu-edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Regular Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Membership Price (₹)</label>
              <input type="number" name="membershipPrice" value={formData.membershipPrice} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} />
                Vegetarian
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                Available
              </label>
            </div>
          </div>

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      )}
    </div>
  );
}
