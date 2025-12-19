import React, { useState } from 'react';
import './AddDeliveryBoyModal.css';

export default function AddDeliveryBoyModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
    profileImage: null,
    password: '',
    confirmPassword: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+91\s\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be in format: +91 9876543210';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newDeliveryBoy = {
        id: Date.now(), // Simple ID generation
        ...formData,
        status: 'offline',
        totalDeliveries: 0,
        todayDeliveries: 0,
        thisWeekDeliveries: 0,
        averageDeliveryTime: '0 min',
        rating: 0,
        joinDate: new Date().toISOString().split('T')[0],
        deliveryHistory: [],
        onTimeDeliveries: 0,
        lateDeliveries: 0,
        activeOrders: []
      };

      onAdd(newDeliveryBoy);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      vehicleType: 'Bike',
      vehicleNumber: '',
      profileImage: null,
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-delivery-boy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Delivery Boy</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+91 9876543210"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
           <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm password"/>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

            <div className="form-vehicle">
              <label className="form-label">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Bicycle">Bicycle</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Number *</label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                className={`form-input ${errors.vehicleNumber ? 'error' : ''}`}
                placeholder="MH12AB1234"
              />
              {errors.vehicleNumber && <span className="error-message">{errors.vehicleNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Profile preview" className="preview-image" />
                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Delivery Boy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}