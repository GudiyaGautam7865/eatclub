import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { orderStatuses } from '../../mock/delivery/deliveryData';
import { useDelivery } from '../../context/DeliveryContext';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const { acceptOrder, rejectOrder, updateOrderStatus } = useDelivery();
  const [updating, setUpdating] = useState(false);
  const [socket, setSocket] = useState(null);
  
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected for OrderCard');
    });
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);
  
  // Check if order is available (not yet assigned to driver)
  const isAvailable = order.status === 'available' || !order.driverId;
  const statusKey = order.status === 'picked_up' ? 'picked_up' : order.status;
  const statusInfo = orderStatuses[statusKey] || { label: order.status, color: '#555', bgColor: '#eee' };
  
  const handleAccept = async (e) => {
    e.stopPropagation();
    setUpdating(true);
    try {
      // Accept order with orderId
      await acceptOrder(order.id);
      
      // Emit socket event for order acceptance using SAME orderId
      if (socket) {
        const deliveryBoyId = JSON.parse(localStorage.getItem('ec_user') || '{}')._id;
        socket.emit('orderAccepted', {
          orderId: order.id,
          deliveryBoyId: deliveryBoyId,
          timestamp: new Date().toISOString()
        });
        
        // Join the order-specific room using orderId
        socket.emit('joinOrderRoom', order.id);
      }
      
      // Navigate to order details for tracking
      navigate(`/delivery/orders/${order.id}`);
    } catch (err) {
      console.error('❌ Accept failed:', err);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleReject = (e) => {
    e.stopPropagation();
    rejectOrder(order.id);
  };
  
  const handleStatusUpdate = async (e, newStatus) => {
    e.stopPropagation();
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/delivery/orders/${order.id}`);
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
      case 'assigned': return 'Mark as Picked';
      case 'picked_up': return 'Start Delivery';
      case 'on_the_way': return 'Mark Delivered';
      default: return null;
    }
  };

  return (
    <div className="order-card" onClick={handleCardClick}>
      <div className="order-card-header">
        <div className="order-id">#{order.id}</div>
        <div 
          className="order-status"
          style={{ 
            color: statusInfo.color, 
            backgroundColor: statusInfo.bgColor 
          }}
        >
          {statusInfo.label}
        </div>
      </div>
      
      <div className="order-details">
        <div className="customer-info">
          <h3>{order.customerName}</h3>
          <p>{order.customerPhone}</p>
        </div>
        
        <div className="restaurant-info">
          <div className="location-item">
            <span className="location-icon">🏪</span>
            <div>
              <strong>{order.restaurantName}</strong>
              <p>{order.restaurantAddress}</p>
            </div>
          </div>
          
          <div className="location-item">
            <span className="location-icon">📍</span>
            <div>
              <strong>Delivery Address</strong>
              <p>{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
        
        <div className="order-meta">
          <div className="payment-mode">
            <span className={`payment-badge ${order.paymentMode.toLowerCase()}`}>
              {order.paymentMode}
            </span>
          </div>
          <div className="order-value">₹{order.orderValue}</div>
        </div>
      </div>
      
      <div className="order-actions">
        {isAvailable && (
          <button 
            className="btn-accept"
            onClick={handleAccept}
            disabled={updating}
          >
            {updating ? 'Accepting...' : '🚀 Accept Order'}
          </button>
        )}
        
        {!isAvailable && order.status === 'assigned' && (
          <button 
            className="btn-update-status"
            onClick={(e) => handleStatusUpdate(e, getNextStatus())}
            disabled={updating}
          >
            {updating ? 'Updating...' : getNextStatusLabel()}
          </button>
        )}
        
        {!isAvailable && order.status !== 'assigned' && order.status !== 'delivered' && getNextStatus() && (
          <button 
            className="btn-update-status"
            onClick={(e) => handleStatusUpdate(e, getNextStatus())}
            disabled={updating}
          >
            {updating ? 'Updating...' : getNextStatusLabel()}
          </button>
        )}
        
        {order.status === 'delivered' && (
          <div className="delivered-badge">✅ Completed</div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;