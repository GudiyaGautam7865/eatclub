import React from 'react';
import './OrdersTable.css';

export default function OrdersTable({ orders, onRowClick }) {
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
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Type</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} onClick={() => onRowClick(order.id, order.type)}>
              <td className="order-id-cell">{order.id}</td>
              <td><span className="type-badge">{(order.type || '').toString().toUpperCase()}</span></td>
              <td>{order.customerName}</td>
              <td>{order.customerPhone}</td>
              <td>{Array.isArray(order.items) ? order.items.length : (order.itemCount ?? 0)}</td>
              <td className="amount-cell">₹{order.totalAmount}</td>
              <td><span className="payment-badge">{(order.paymentMethod || 'COD').toString().toUpperCase()}</span></td>
              <td>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {(order.status || '').toString().toUpperCase()}
                </span>
              </td>
              <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
