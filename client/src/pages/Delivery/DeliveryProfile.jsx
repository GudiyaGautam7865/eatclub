import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import './DeliveryProfile.css';
import './DeliveryProfileHeader.css';

const DeliveryProfile = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: '',
    vehicleNumber: ''
  });

  useEffect(() => {
    // Get delivery boy info from localStorage
    const userStr = localStorage.getItem('ec_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'DELIVERY_BOY') {
        const partnerData = {
          name: user.name,
          phone: user.phone || 'Not provided',
          email: user.email,
          vehicleType: user.vehicleType || 'BIKE',
          vehicleNumber: user.vehicleNumber || 'Not provided',
          id: user.id,
          rating: 4.8,
          totalDeliveries: 127,
          joinedDate: new Date('2024-01-01'),
          isOnline: true,
          profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=100`,
        };
        setPartner(partnerData);
        setFormData({
          name: partnerData.name,
          phone: partnerData.phone,
          email: partnerData.email,
          vehicleType: partnerData.vehicleType,
          vehicleNumber: partnerData.vehicleNumber,
        });
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!partner) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

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
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
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
    <div className="db-delivery-profile">
      <div className="db-delivery-profile-header">
        <div className="db-delivery-profile-avatar">
          <img 
            src={partner.profilePhoto} 
            alt={partner.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=6366f1&color=fff&size=100`;
            }}
          />
        </div>
        
        <div className="db-delivery-profile-info">
          <h1>{partner.name}</h1>
          <p className="db-delivery-partner-id">ID: {partner.id}</p>
          <div className="db-delivery-rating-badge">
            ⭐ {partner.rating} Rating
          </div>
        </div>

        <button 
          className="db-delivery-edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="db-profile-stats">
        {profileStats.map((stat, index) => (
          <div key={index} className="db-stat-card">
            <span className="db-stat-icon">{stat.icon}</span>
            <div className="db-stat-info">
              <span className="db-stat-value">{stat.value}</span>
              <span className="db-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="db-profile-details">
        <div className="db-details-section">
          <h3>Personal Information</h3>
          <div className="db-details-form">
            <div className="db-form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="db-form-value">{partner.name}</span>
              )}
            </div>

            <div className="db-form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="db-form-value">{partner.phone}</span>
              )}
            </div>

            <div className="db-form-group">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="db-form-value">{partner.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="db-details-section">
          <h3>Vehicle Information</h3>
          <div className="db-details-form">
            <div className="db-form-group">
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
                <span className="db-form-value">{partner.vehicleType}</span>
              )}
            </div>

            <div className="db-form-group">
              <label>Vehicle Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="db-form-value">{partner.vehicleNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="db-form-actions">
          <button className="db-save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="db-cancel-btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      )}

      <div className="db-profile-actions">
        <div className="db-action-section">
          <h3>Account Actions</h3>
          <div className="db-action-buttons">
            <button className="db-action-btn">
              <span className="db-action-icon">📱</span>
              <span>Contact Support</span>
            </button>
            <button className="db-action-btn">
              <span className="db-action-icon">📋</span>
              <span>Terms & Conditions</span>
            </button>
            <button className="db-action-btn">
              <span className="db-action-icon">🔒</span>
              <span>Privacy Policy</span>
            </button>
            <button className="db-action-btn">
              <span className="db-action-icon">ℹ️</span>
              <span>About App</span>
            </button>
          </div>
        </div>

        <div className="db-logout-section">
          <button className="db-logout-btn" onClick={handleLogout}>
            <span className="db-logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;