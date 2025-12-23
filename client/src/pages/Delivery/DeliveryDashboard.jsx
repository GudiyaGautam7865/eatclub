import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/delivery/StatsCard';
import './DeliveryDashboard.css';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 127,
    pendingDeliveries: 3,
    completedToday: 8,
    earnings: 4250,
    rating: 4.8,
  });

  useEffect(() => {
    // Get delivery boy info from localStorage
    const userStr = localStorage.getItem('ec_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'DELIVERY_BOY') {
        setDeliveryBoy(user);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  if (!deliveryBoy) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  const partner = { name: deliveryBoy.name };

  return (
    <div className="delivery-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {partner.name}</h1>
          <p>Here's your delivery summary for today</p>
        </div>
        
        <div className="online-toggle">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isOnline}
              onChange={toggleOnlineStatus}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          icon="📦"
          color="#6366f1"
          subtitle="Today"
        />
        
        <StatsCard
          title="Pending Orders"
          value={stats.pendingDeliveries}
          icon="⏳"
          color="#f59e0b"
          subtitle="Awaiting pickup"
        />
        
        <StatsCard
          title="Completed"
          value={stats.completedToday}
          icon="✅"
          color="#10b981"
          subtitle="Successfully delivered"
        />
        
        <StatsCard
          title="Earnings Today"
          value={`₹${stats.earnings}`}
          icon="💰"
          color="#8b5cf6"
          subtitle="Total earned"
        />
      </div>

      <div className="dashboard-content">
        <div className="performance-card">
          <h3>Today's Performance</h3>
          <div className="performance-stats">
            <div className="perf-item">
              <span className="perf-label">Distance Covered</span>
              <span className="perf-value">45.2 km</span>
            </div>
            <div className="perf-item">
              <span className="perf-label">Average Rating</span>
              <span className="perf-value">⭐ {stats.rating}</span>
            </div>
            <div className="perf-item">
              <span className="perf-label">Total Deliveries</span>
              <span className="perf-value">{stats.totalDeliveries}</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn support">
              <span className="action-icon">📞</span>
              <span>Contact Support</span>
            </button>
            <button className="action-btn orders">
              <span className="action-icon">📋</span>
              <span>View Orders</span>
            </button>
            <button className="action-btn earnings">
              <span className="action-icon">📊</span>
              <span>View Earnings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;