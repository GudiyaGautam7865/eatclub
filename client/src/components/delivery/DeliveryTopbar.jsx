import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryTopbar.css';

const DeliveryTopbar = ({ deliveryBoy }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/delivery/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNotificationClick = () => {
    navigate('/delivery/notifications');
  };

  const handleProfileMenuClick = (action) => {
    setShowProfileMenu(false);
    switch (action) {
      case 'profile':
        navigate('/delivery/profile');
        break;
      case 'logout':
        localStorage.removeItem('ec_user');
        navigate('/');
        break;
    }
  };

  return (
    <div className="delivery-topbar">
      <div className="topbar-left">
        <div className="logo-section">
          <h2>EatClub</h2>
          <span className="delivery-badge">Delivery</span>
        </div>
      </div>

      <div className="topbar-center">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-icon">🔍</button>
        </form>
      </div>

      <div className="topbar-right">
        <div className="notification-icon" onClick={handleNotificationClick}>
          <span>🔔</span>
          <span className="notification-badge">2</span>
        </div>

        <div className="profile-section" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <img 
            src={deliveryBoy?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(deliveryBoy?.name || 'User')}&background=6366f1&color=fff&size=40`}
            alt={deliveryBoy?.name}
          />
          <div className="profile-info">
            <span className="profile-name">{deliveryBoy?.name || 'Delivery Partner'}</span>
            <span className="profile-role">Delivery Partner</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>

        {showProfileMenu && (
          <div className="profile-dropdown">
            <div className="dropdown-item" onClick={() => handleProfileMenuClick('profile')}>👤 View Profile</div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout" onClick={() => handleProfileMenuClick('logout')}>🚪 Logout</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTopbar;