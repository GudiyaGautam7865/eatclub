import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DeliveryTopbar from './DeliveryTopbar';
import './DeliveryLayout.css';

const DeliveryLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('ec_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'DELIVERY_BOY') {
        setDeliveryBoy(user);
      }
    }
  }, []);

  const menuItems = [
    { path: '/delivery/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/delivery/orders', icon: '📦', label: 'Orders' },
    { path: '/delivery/earnings', icon: '💰', label: 'Earnings' },
    { path: '/delivery/profile', icon: '👤', label: 'Profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="delivery-layout">
      {/* Topbar */}
      <DeliveryTopbar deliveryBoy={deliveryBoy} />
      
      {/* Mobile Header */}
      <div className="delivery-mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <h1>EatClub Delivery</h1>
        <div className="header-actions">
          <span className="notification-icon">🔔</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="delivery-content">
        <div className={`delivery-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>EatClub</h2>
            <span className="delivery-badge">Delivery</span>
          </div>
          
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="delivery-main">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="delivery-bottom-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DeliveryLayout;