import React from 'react';
import { useNavigate } from 'react-router-dom';
import { orderStatuses } from '../../mock/delivery/deliveryData';
import { useDelivery } from '../../context/DeliveryContext';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const { acceptOrder, rejectOrder, updateOrderStatus } = useDelivery();
  
  const statusInfo = orderStatuses[order.status];
  
  const handleAccept = (e) => {
    e.stopPropagation();
    acceptOrder(order.id);
  };
  
  const handleReject = (e) => {
    e.stopPropagation();
    rejectOrder(order.id);
  };
  
  const handleStatusUpdate = (e, newStatus) => {
    e.stopPropagation();
    updateOrderStatus(order.id, newStatus);
  };
  
  const handleCardClick = () => {
    navigate(`/delivery/orders/${order.id}`);
  };
  
  const getNextStatus = () => {
    switch (order.status) {
      case 'assigned': return 'picked';
      case 'picked': return 'on_the_way';
      case 'on_the_way': return 'delivered';
      default: return null;
    }
  };
  
  const getNextStatusLabel = () => {
    switch (order.status) {
      case 'assigned': return 'Mark as Picked';
      case 'picked': return 'Start Delivery';
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
        {order.status === 'assigned' && (
          <>
            <button 
              className="btn-reject"
              onClick={handleReject}
            >
              Reject
            </button>
            <button 
              className="btn-accept"
              onClick={handleAccept}
            >
              Accept
            </button>
          </>
        )}
        
        {order.status !== 'assigned' && order.status !== 'delivered' && getNextStatus() && (
          <button 
            className="btn-update-status"
            onClick={(e) => handleStatusUpdate(e, getNextStatus())}
          >
            {getNextStatusLabel()}
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