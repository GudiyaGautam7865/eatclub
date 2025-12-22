import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDelivery } from '../../context/DeliveryContext';
import { orderStatuses } from '../../mock/delivery/deliveryData';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { ordersList, updateOrderStatus } = useDelivery();
  const [socket, setSocket] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  const order = ordersList.find(o => o.id === orderId);
  
  // Initialize socket and GPS tracking
  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected for OrderDetails');
      // Join the order room using orderId
      newSocket.emit('joinOrderRoom', orderId);
    });
    
    setSocket(newSocket);
    
    // Start GPS tracking automatically when accepted
    if (order && order.status !== 'available' && order.driverId) {
      startGPSTracking(newSocket);
    }
    
    return () => {
      // Cleanup: stop tracking and disconnect socket
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (newSocket) newSocket.disconnect();
    };
  }, [orderId, order?.status, order?.driverId]);
  
  // Start GPS tracking
  const startGPSTracking = (socketInstance) => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setIsTracking(true);
          
          // Emit location update using orderId
          if (socketInstance && orderId) {
            socketInstance.emit('deliveryLocationUpdate', {
              orderId,
              lat: location.lat,
              lng: location.lng,
              timestamp: new Date().toISOString()
            });
          }
        },
        (error) => {
          console.warn('⚠️ Geolocation error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      
      setWatchId(id);
    } else {
      console.warn('⚠️ Geolocation not supported');
    }
  };
  
  // Stop GPS tracking when order is delivered
  useEffect(() => {
    if (order?.status === 'delivered' && watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      console.log('🛑 GPS tracking stopped - order delivered');
    }
  }, [order?.status, watchId]);
  
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
        {isTracking && (
          <div style={{ marginLeft: 'auto', padding: '10px 15px', backgroundColor: '#10b981', color: 'white', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>
            📍 Live Tracking Active {currentLocation && `(${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)})`}
          </div>
        )}
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