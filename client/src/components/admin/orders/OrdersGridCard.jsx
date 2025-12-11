import React from 'react';
import './OrdersGridCard.css';

export default function OrdersGridCard({ order, onClick }) {
  const getStatusColor = (status) => {
    const colors = {
      placed: '#3b82f6',
      preparing: '#f59e0b',
      completed: '#10b981',
      cancelled: '#ef4444',
      pending: '#6b7280',
      confirmed: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="order-grid-card" onClick={onClick}>
      <div className="order-card-header">
        <span className="order-id">{order.id}</span>
        <span className="order-type-badge">{order.type}</span>
      </div>

      <div className="order-card-status" style={{ backgroundColor: getStatusColor(order.status) }}>
        {order.status.toUpperCase()}
      </div>

      <div className="order-card-customer">
        <div className="customer-name">{order.customerName}</div>
        <div className="customer-phone">{order.customerPhone}</div>
      </div>

      <div className="order-card-items">
        {order.items.length} item{order.items.length > 1 ? 's' : ''}
      </div>

      <div className="order-card-footer">
        <span className="order-amount">₹{order.totalAmount}</span>
        <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
