import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeliveryBoyStatsCard from '../../../components/admin/deliveryboys/DeliveryBoyStatsCard';
import { DeliveryLineChart, DeliveryDonutChart } from '../../../components/admin/deliveryboys/DeliveryCharts';
import { getDeliveryBoyById } from '../../../services/deliveryBoyService';
import deliveryBoysData from '../../../mock/deliveryboys.json';
import './DeliveryBoyDetailsPage.css';

export default function DeliveryBoyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveryBoyDetails();
  }, [id]);

  const loadDeliveryBoyDetails = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend API first
      try {
        const backendBoy = await getDeliveryBoyById(id);
        if (backendBoy) {
          // Map backend data to match expected format
          const mappedBoy = {
            id: backendBoy._id || backendBoy.id,
            name: backendBoy.name,
            phone: backendBoy.phone,
            email: backendBoy.email,
            vehicleType: backendBoy.vehicleType,
            vehicleNumber: backendBoy.vehicleNumber || 'N/A',
            status: backendBoy.deliveryStatus?.toLowerCase() || 'offline',
            totalDeliveries: backendBoy.totalDeliveries || 0,
            todayDeliveries: 0,
            thisWeekDeliveries: 0,
            averageDeliveryTime: '0 min',
            rating: backendBoy.rating || 0,
            joinDate: backendBoy.createdAt ? new Date(backendBoy.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            activeOrders: [],
            profileImage: backendBoy.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendBoy.name)}&background=random`,
          };
          setDeliveryBoy(mappedBoy);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.warn('Failed to fetch from API, falling back to mock data:', apiError.message);
      }

      // Fallback to mock data (for backward compatibility)
      const deletedDeliveryBoys = localStorage.getItem('deletedDeliveryBoys') || '[]';
      const deletedList = JSON.parse(deletedDeliveryBoys);
      
      let allDeliveryBoys = deliveryBoysData.deliveryBoys.filter(boy => !deletedList.includes(boy.id));
      
      const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
      if (savedDeliveryBoys) {
        const parsedSaved = JSON.parse(savedDeliveryBoys);
        const existingIds = allDeliveryBoys.map(boy => boy.id);
        const newDeliveryBoys = parsedSaved.filter(boy => !existingIds.includes(boy.id));
        allDeliveryBoys = [...allDeliveryBoys, ...newDeliveryBoys];
      }
      
      const boy = allDeliveryBoys.find(b => b.id === parseInt(id) || b.id === id);
      setDeliveryBoy(boy);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load delivery boy details:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      online: { label: 'Online', class: 'status-online' },
      offline: { label: 'Offline', class: 'status-offline' },
      busy: { label: 'Busy', class: 'status-busy' }
    };
    return statusConfig[status] || statusConfig.offline;
  };

  const handleCallRider = () => {
    console.log('Call rider:', deliveryBoy.phone);
  };

  const handleMessageRider = () => {
    console.log('Message rider:', deliveryBoy.id);
  };

  const handleDeactivateRider = () => {
    console.log('Deactivate rider:', deliveryBoy.id);
  };

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      picked_up: { label: 'Picked Up', class: 'order-status-picked' },
      on_the_way: { label: 'On The Way', class: 'order-status-onway' },
      delivering: { label: 'Delivering', class: 'order-status-delivering' }
    };
    return statusConfig[status] || { label: status, class: 'order-status-default' };
  };

  if (loading) {
    return (
      <div className="delivery-boy-details-loading">
        <div className="loading-spinner">Loading delivery boy details...</div>
      </div>
    );
  }

  if (!deliveryBoy) {
    return (
      <div className="delivery-boy-not-found">
        <h2>Delivery Boy Not Found</h2>
        <button onClick={() => navigate('/admin/delivery-boys')}>
          Back to Delivery Boys
        </button>
      </div>
    );
  }

  const statusInfo = getStatusBadge(deliveryBoy.status);

  return (
    <div className="delivery-boy-details-page">
      {/* Header */}
      <div className="details-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/admin/delivery-boys')}
        >
          ← Back to Delivery Boys
        </button>
        <div className="header-actions">
          <button className="call-btn" onClick={handleCallRider}>
            📞 Call Rider
          </button>
          <button className="message-btn" onClick={handleMessageRider}>
            💬 Message Rider
          </button>
          <button className="deactivate-btn" onClick={handleDeactivateRider}>
            ⚠️ Deactivate Rider
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-image-large">
            <img 
              src={deliveryBoy.profileImage} 
              alt={deliveryBoy.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="profile-fallback-large">
              {deliveryBoy.name.charAt(0)}
            </div>
          </div>
          <div className="profile-info-detailed">
            <h1 className="delivery-boy-name-large">{deliveryBoy.name}</h1>
            <div className={`status-badge-large ${statusInfo.class}`}>
              {statusInfo.label}
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <span className="contact-value">{deliveryBoy.phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">{deliveryBoy.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Vehicle:</span>
                <span className="contact-value">{deliveryBoy.vehicleType} - {deliveryBoy.vehicleNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        {/* Statistics Cards */}
        <div className="stats-section">
          <DeliveryBoyStatsCard
            title="Total Deliveries"
            value={deliveryBoy.totalDeliveries}
            subtitle="All time deliveries"
            icon="📦"
            color="blue"
          />
          <DeliveryBoyStatsCard
            title="This Week"
            value={deliveryBoy.thisWeekDeliveries}
            subtitle="Deliveries this week"
            icon="📅"
            color="green"
          />
          <DeliveryBoyStatsCard
            title="Avg Delivery Time"
            value={deliveryBoy.averageDeliveryTime}
            subtitle="Average time per delivery"
            icon="⏱️"
            color="orange"
          />
          <DeliveryBoyStatsCard
            title="Rating"
            value={deliveryBoy.rating}
            subtitle="Customer rating"
            icon="⭐"
            color="purple"
          />
        </div>

        <div className="details-main">
          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">📈 Deliveries Last 7 Days</h3>
              </div>
              <DeliveryLineChart data={deliveryBoy.deliveryHistory} />
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">⏰ On-Time Performance</h3>
              </div>
              <DeliveryDonutChart 
                onTimeDeliveries={deliveryBoy.onTimeDeliveries}
                lateDeliveries={deliveryBoy.lateDeliveries}
              />
            </div>
          </div>

          {/* Active Orders */}
          <div className="active-orders-section">
            <h3 className="section-title">🚚 Active Orders ({deliveryBoy.activeOrders.length})</h3>
            {deliveryBoy.activeOrders.length === 0 ? (
              <div className="no-active-orders">
                <p>No active orders at the moment</p>
              </div>
            ) : (
              <div className="active-orders-list">
                {deliveryBoy.activeOrders.map((order) => {
                  const orderStatus = getOrderStatusBadge(order.status);
                  return (
                    <div key={order.orderId} className="active-order-card">
                      <div className="order-info">
                        <div className="order-id">{order.orderId}</div>
                        <div className="customer-name">{order.customerName}</div>
                        <div className="order-address">{order.address}</div>
                      </div>
                      <div className="order-status-info">
                        <div className={`order-status-badge ${orderStatus.class}`}>
                          {orderStatus.label}
                        </div>
                        <div className="estimated-time">ETA: {order.estimatedTime}</div>
                        <div className="map-placeholder">🗺️ Map</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}