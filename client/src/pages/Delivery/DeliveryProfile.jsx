import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDelivery } from '../../context/DeliveryContext';
import './DeliveryProfile.css';

const DeliveryProfile = () => {
  const { partner } = useDelivery();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: partner.name,
    phone: partner.phone,
    email: partner.email,
    vehicleType: partner.vehicleType,
    vehicleNumber: partner.vehicleNumber
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would typically update the partner data via API
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear auth data and redirect
      navigate('/');
    }
  };

  const profileStats = [
    { label: 'Total Deliveries', value: partner.totalDeliveries, icon: '📦' },
    { label: 'Rating', value: `⭐ ${partner.rating}`, icon: '⭐' },
    { label: 'Member Since', value: new Date(partner.joinedDate).getFullYear(), icon: '📅' },
    { label: 'Vehicle', value: partner.vehicleType, icon: '🏍️' }
  ];

  return (
    <div className="delivery-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={partner.profilePhoto} 
            alt={partner.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/100/ff6b35/ffffff?text=' + partner.name.charAt(0);
            }}
          />
          <div className="online-indicator">
            <span className={`status-dot ${partner.isOnline ? 'online' : 'offline'}`}></span>
          </div>
        </div>
        
        <div className="profile-info">
          <h1>{partner.name}</h1>
          <p className="partner-id">ID: {partner.id}</p>
          <div className="rating-badge">
            ⭐ {partner.rating} Rating
          </div>
        </div>

        <button 
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-stats">
        {profileStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="profile-details">
        <div className="details-section">
          <h3>Personal Information</h3>
          <div className="details-form">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{partner.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{partner.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{partner.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Vehicle Information</h3>
          <div className="details-form">
            <div className="form-group">
              <label>Vehicle Type</label>
              {isEditing ? (
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                >
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Car">Car</option>
                </select>
              ) : (
                <span className="form-value">{partner.vehicleType}</span>
              )}
            </div>

            <div className="form-group">
              <label>Vehicle Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{partner.vehicleNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="form-actions">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      )}

      <div className="profile-actions">
        <div className="action-section">
          <h3>Account Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">📱</span>
              <span>Contact Support</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📋</span>
              <span>Terms & Conditions</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🔒</span>
              <span>Privacy Policy</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">ℹ️</span>
              <span>About App</span>
            </button>
          </div>
        </div>

        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;