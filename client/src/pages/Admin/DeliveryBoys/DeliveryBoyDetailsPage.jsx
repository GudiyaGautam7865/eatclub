import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeliveryBoyDetails } from '../../../services/deliveryBoyService';
import './DeliveryBoyDetailsPage.css';

export default function DeliveryBoyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryBoyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDeliveryBoyDetails(id);
        
        // Transform the API response to match the component's data structure
        const transformedData = {
          id: response.profile.id,
          name: response.profile.name,
          phone: response.profile.phone,
          email: response.profile.email,
          vehicleType: response.profile.vehicleType,
          vehicleNumber: response.profile.vehicleNumber,
          status: response.profile.deliveryStatus,
          rating: parseFloat(response.stats.averageRating),
          totalDeliveries: response.stats.totalDeliveries,
          totalEarnings: response.stats.totalEarnings,
          currentMonthEarnings: response.stats.totalEarnings, // Can be calculated from weeklyEarnings
          currentMonthDeliveries: response.stats.completedDeliveries,
          joinedDate: new Date(response.profile.joiningDate).toLocaleDateString(),
          lastActive: new Date().toISOString(),
          address: 'N/A', // Add to backend if needed
          emergencyContact: 'N/A', // Add to backend if needed
          recentOrders: response.recentOrders.map(order => ({
            id: order.orderId,
            customer: order.customerName,
            restaurant: order.restaurantName,
            status: order.status,
            amount: order.amount,
            address: order.address,
            time: formatTimeAgo(new Date(order.orderDate)),
            orderDate: order.orderDate,
            deliveredAt: order.deliveredAt
          })),
          weeklyEarnings: response.weeklyEarnings,
          performance: {
            onTimeDeliveries: parseFloat(response.performance.onTimeDeliveryRate),
            averageDeliveryTime: 28, // Add to backend if tracking
            customerRatings: parseFloat(response.performance.averageRating),
            totalRatings: response.performance.totalRatings,
            totalDistance: response.performance.totalDistance
          }
        };

        setDeliveryBoy(transformedData);
      } catch (err) {
        console.error('Error fetching delivery boy details:', err);
        setError(err.message || 'Failed to fetch delivery boy details');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryBoyDetails();
  }, [id]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="delivery-boy-details-page">
        <div className="loading-state">Loading delivery boy details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="delivery-boy-details-page">
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={() => navigate('/admin/delivery-boys')}>Back to List</button>
        </div>
      </div>
    );
  }

  if (!deliveryBoy) {
    return (
      <div className="delivery-boy-details-page">
        <div className="error-state">Delivery boy not found</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: '#10b981',
      INACTIVE: '#6b7280',
      ON_DELIVERY: '#f59e0b',
      OFFLINE: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="delivery-boy-details-page">
      {/* Header */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/admin/delivery-boys')}>
          ← Back to List
        </button>
        <div className="header-actions">
          <button className="action-btn secondary">Edit Profile</button>
          <button className="action-btn danger">Suspend Account</button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="db-profile-card">
        <div className="db-profile-left">
          <div className="db-profile-avatar">
            <span className="db-avatar-text">{deliveryBoy.name.charAt(0)}</span>
          </div>
          <div className="db-profile-info">
            <h1 className="db-profile-name">{deliveryBoy.name}</h1>
            <p className="db-profile-id">ID: {deliveryBoy.id}</p>
            <div className="db-profile-meta">
              <span className="db-meta-item">📞 {deliveryBoy.phone}</span>
              <span className="db-meta-item">✉️ {deliveryBoy.email}</span>
              <span className="db-meta-item">🏍️ {deliveryBoy.vehicleType} • {deliveryBoy.vehicleNumber}</span>
            </div>
          </div>
        </div>
        <div className="db-profile-right">
          <div className="status-badge" style={{ backgroundColor: getStatusColor(deliveryBoy.status) }}>
            {deliveryBoy.status}
          </div>
          <div className="rating-display">
            <span className="rating-star">⭐</span>
            <span className="rating-value">{deliveryBoy.rating}</span>
            <span className="rating-count">({deliveryBoy.performance.totalRatings} ratings)</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <p className="stat-label">Total Deliveries</p>
            <h3 className="stat-value">{deliveryBoy.totalDeliveries.toLocaleString()}</h3>
            <p className="stat-change">+{deliveryBoy.currentMonthDeliveries} this month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Earnings</p>
            <h3 className="stat-value">₹{deliveryBoy.totalEarnings.toLocaleString()}</h3>
            <p className="stat-change">+₹{deliveryBoy.currentMonthEarnings.toLocaleString()} this month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <p className="stat-label">Avg. Delivery Time</p>
            <h3 className="stat-value">{deliveryBoy.performance.averageDeliveryTime} min</h3>
            <p className="stat-change success">12% faster than average</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">On-Time Rate</p>
            <h3 className="stat-value">{deliveryBoy.performance.onTimeDeliveries}%</h3>
            <p className="stat-change success">Excellent performance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="details-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Recent Orders
        </button>
        <button
          className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </button>
        <button
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="info-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{deliveryBoy.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{deliveryBoy.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{deliveryBoy.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Emergency Contact</span>
                  <span className="info-value">{deliveryBoy.emergencyContact}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{deliveryBoy.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Joined Date</span>
                  <span className="info-value">{deliveryBoy.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Vehicle Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Vehicle Type</span>
                  <span className="info-value">{deliveryBoy.vehicleType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Vehicle Number</span>
                  <span className="info-value">{deliveryBoy.vehicleNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-content">
            <table className="db-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {deliveryBoy.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td className="order-amount">₹{order.amount}</td>
                    <td>
                      <span className={`db-status-pill ${order.status.toLowerCase()}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="order-time">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="earnings-content">
            <div className="earnings-card">
              <h3 className="earnings-title">Earnings Breakdown</h3>
              <div className="earnings-list">
                <div className="earnings-row">
                  <span className="earnings-label">Total Lifetime Earnings</span>
                  <span className="earnings-value">₹{deliveryBoy.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="earnings-row">
                  <span className="earnings-label">Current Month</span>
                  <span className="earnings-value">₹{deliveryBoy.currentMonthEarnings.toLocaleString()}</span>
                </div>
                <div className="earnings-row">
                  <span className="earnings-label">Average per Delivery</span>
                  <span className="earnings-value">₹{Math.round(deliveryBoy.totalEarnings / deliveryBoy.totalDeliveries)}</span>
                </div>
                <div className="earnings-row">
                  <span className="earnings-label">Pending Payout</span>
                  <span className="earnings-value pending">₹2,450</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-content">
            <div className="performance-metrics">
              <div className="db-metric-card">
                <h4 className="db-metric-title">On-Time Delivery Rate</h4>
                <div className="db-metric-bar">
                  <div className="db-metric-fill" style={{ width: `${deliveryBoy.performance.onTimeDeliveries}%` }}></div>
                </div>
                <p className="db-metric-value">{deliveryBoy.performance.onTimeDeliveries}%</p>
              </div>
              <div className="db-metric-card">
                <h4 className="db-metric-title">Customer Ratings</h4>
                <div className="db-rating-breakdown">
                  <div className="db-rating-bar">
                    <span>5 ⭐</span>
                    <div className="db-bar"><div className="db-fill" style={{ width: '75%' }}></div></div>
                    <span>75%</span>
                  </div>
                  <div className="db-rating-bar">
                    <span>4 ⭐</span>
                    <div className="db-bar"><div className="db-fill" style={{ width: '20%' }}></div></div>
                    <span>20%</span>
                  </div>
                  <div className="db-rating-bar">
                    <span>3 ⭐</span>
                    <div className="db-bar"><div className="db-fill" style={{ width: '4%' }}></div></div>
                    <span>4%</span>
                  </div>
                  <div className="db-rating-bar">
                    <span>2 ⭐</span>
                    <div className="db-bar"><div className="db-fill" style={{ width: '1%' }}></div></div>
                    <span>1%</span>
                  </div>
                  <div className="db-rating-bar">
                    <span>1 ⭐</span>
                    <div className="db-bar"><div className="db-fill" style={{ width: '0%' }}></div></div>
                    <span>0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
