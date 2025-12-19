import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDelivery } from '../../context/DeliveryContext';
import { orderStatuses } from '../../mock/delivery/deliveryData';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { ordersList, updateOrderStatus } = useDelivery();
  
  const order = ordersList.find(o => o.id === orderId);
  
  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order not found</h2>
        <button onClick={() => navigate('/delivery/orders')}>
          Back to Orders
        </button>
      </div>
    );
  }
  
  const statusKey = order.status === 'picked_up' ? 'picked_up' : order.status;
  const statusInfo = orderStatuses[statusKey];
  
  const handleStatusUpdate = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };
  
  const getNextStatus = () => {
    switch (order.status) {
      case 'assigned': return 'picked_up';
      case 'picked_up': return 'on_the_way';
      case 'on_the_way': return 'delivered';
      default: return null;
    }
  };
  
  const getNextStatusLabel = () => {
    switch (order.status) {
      case 'assigned': return 'Mark as Picked Up';
      case 'picked_up': return 'Start Delivery';
      case 'on_the_way': return 'Mark as Delivered';
      default: return null;
    }
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleMap = (coordinates, type) => {
    const { lat, lng } = coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="order-details">
      <div className="order-details-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/delivery/orders')}
        >
          ← Back
        </button>
        <div className="order-info">
          <h1>Order #{order.id}</h1>
          <div 
            className="order-status-badge"
            style={{ 
              color: statusInfo.color, 
              backgroundColor: statusInfo.bgColor 
            }}
          >
            {statusInfo.label}
          </div>
        </div>
      </div>

      <div className="order-details-content">
        <div className="main-content">
          <div className="customer-section">
            <h3>Customer Information</h3>
            <div className="info-card">
              <div className="customer-info">
                <h4>{order.customerName}</h4>
                <p>{order.customerPhone}</p>
              </div>
              <button 
                className="call-btn"
                onClick={() => handleCall(order.customerPhone)}
              >
                📞 Call
              </button>
            </div>
          </div>

          <div className="locations-section">
            <h3>Pickup & Delivery</h3>
            
            <div className="location-card pickup">
              <div className="location-header">
                <span className="location-icon">🏪</span>
                <div>
                  <h4>Pickup Location</h4>
                  <p className="restaurant-name">{order.restaurantName}</p>
                </div>
              </div>
              <p className="address">{order.restaurantAddress}</p>
              <div className="location-actions">
                <button 
                  className="call-btn small"
                  onClick={() => handleCall(order.restaurantPhone)}
                >
                  📞 Call Restaurant
                </button>
                <button 
                  className="map-btn small"
                  onClick={() => handleMap(order.coordinates.restaurant, 'pickup')}
                >
                  🗺️ View on Map
                </button>
              </div>
            </div>

            <div className="location-card delivery">
              <div className="location-header">
                <span className="location-icon">📍</span>
                <div>
                  <h4>Delivery Location</h4>
                  <p className="customer-name">{order.customerName}</p>
                </div>
              </div>
              <p className="address">{order.deliveryAddress}</p>
              <div className="location-actions">
                <button 
                  className="call-btn small"
                  onClick={() => handleCall(order.customerPhone)}
                >
                  📞 Call Customer
                </button>
                <button 
                  className="map-btn small"
                  onClick={() => handleMap(order.coordinates.delivery, 'delivery')}
                >
                  🗺️ View on Map
                </button>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                  <span className="item-price">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Order Value</span>
              <span>₹{order.orderValue}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{order.orderValue + order.deliveryFee}</span>
            </div>
            <div className="payment-mode">
              <span className={`payment-badge ${order.paymentMode.toLowerCase()}`}>
                {order.paymentMode}
              </span>
            </div>
          </div>

          {order.status !== 'delivered' && getNextStatus() && (
            <div className="action-section">
              <button 
                className="primary-action-btn"
                onClick={() => handleStatusUpdate(getNextStatus())}
              >
                {getNextStatusLabel()}
              </button>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="completed-section">
              <div className="completed-badge">
                ✅ Order Completed
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;