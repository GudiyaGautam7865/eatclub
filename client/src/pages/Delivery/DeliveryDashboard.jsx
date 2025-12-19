import React from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import StatsCard from '../../components/delivery/StatsCard';
import './DeliveryDashboard.css';

const DeliveryDashboard = () => {
  const { partner, stats, isOnline, toggleOnlineStatus } = useDelivery();

  return (
    <div className="delivery-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {partner.name}!</h1>
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
          color="#2196f3"
          subtitle="Today"
        />
        
        <StatsCard
          title="Pending Orders"
          value={stats.pendingDeliveries}
          icon="⏳"
          color="#ff9800"
          subtitle="Awaiting pickup"
        />
        
        <StatsCard
          title="Completed"
          value={stats.completedDeliveries}
          icon="✅"
          color="#4caf50"
          subtitle="Successfully delivered"
        />
        
        <StatsCard
          title="Earnings Today"
          value={`₹${stats.earningsToday}`}
          icon="💰"
          color="#9c27b0"
          subtitle="Total earned"
        />
      </div>

      <div className="dashboard-content">
        <div className="performance-card">
          <h3>Today's Performance</h3>
          <div className="performance-stats">
            <div className="perf-item">
              <span className="perf-label">Distance Covered</span>
              <span className="perf-value">{stats.totalDistance} km</span>
            </div>
            <div className="perf-item">
              <span className="perf-label">Average Rating</span>
              <span className="perf-value">⭐ {partner.rating}</span>
            </div>
            <div className="perf-item">
              <span className="perf-label">Total Deliveries</span>
              <span className="perf-value">{partner.totalDeliveries}</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">📱</span>
              <span>Contact Support</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🗺️</span>
              <span>View Map</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;