import React from 'react';
import './OrdersGridCard.css';

export default function OrdersGridCard({ order = {}, onClick }) {
  const getStatusColor = (status) => {
    const colors = {
      PLACED: '#3b82f6',
      PAID: '#2563eb',
      PREPARING: '#f59e0b',
      READY_FOR_PICKUP: '#14b8a6',
      OUT_FOR_DELIVERY: '#8b5cf6',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444',
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
        {(order.status || '').toString().toUpperCase()}
      </div>

      <div className="order-card-customer">
        <div className="customer-name">{order.customerName || order.customer?.name || '—'}</div>
        <div className="customer-phone">{order.customerPhone || order.customer?.phone || '—'}</div>
      </div>

      <div className="order-card-items">
        {Array.isArray(order.items) ? order.items.length : (order.itemCount ?? 0)} item{(Array.isArray(order.items) ? order.items.length : (order.itemCount ?? 0)) > 1 ? 's' : ''}
      </div>

      <div className="order-card-footer">
        <span className="order-amount">₹{order.totalAmount ?? order.amount ?? '0'}</span>
        <span className="order-date">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</span>
      </div>
    </div>
  );
}
