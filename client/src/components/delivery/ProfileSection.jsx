import React from 'react';
import './ProfileSection.css';

const ProfileSection = ({ deliveryBoy, stats }) => {
  return (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={deliveryBoy.avatar || '/default-avatar.png'} 
            alt={deliveryBoy.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(deliveryBoy.name)}&background=6366f1&color=fff&size=80`;
            }}
          />
          <div className="status-indicator online"></div>
        </div>
        
        <div className="profile-info">
          <h2>{deliveryBoy.name}</h2>
          <p className="profile-id">ID: {deliveryBoy.id}</p>
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span className="rating-value">{stats.rating}</span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{stats.totalDeliveries}</span>
          <span className="stat-label">Total Deliveries</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">₹{stats.earnings}</span>
          <span className="stat-label">Total Earnings</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.completedToday}</span>
          <span className="stat-label">Today's Orders</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-btn primary">
          <span>✏️</span>
          Edit Profile
        </button>
        <button className="profile-btn secondary">
          <span>📊</span>
          View Analytics
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;