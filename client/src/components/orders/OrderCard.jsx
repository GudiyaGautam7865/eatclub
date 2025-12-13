import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';

function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const formatted = date.toLocaleDateString('en-US', options);
  return formatted;
}

export default function OrderCard({ order }) {
  const {
    id,
    restaurantName,
    status,
    totalAmount,
    itemSummary,
    placedAt,
    deliveredAt,
    addressShort,
  } = order;

  const isOngoing =
    status === 'PLACED' || status === 'PREPARING' || status === 'OUT_FOR_DELIVERY';
  const isDelivered = status === 'DELIVERED';

  // Determine date/time string
  const dateTimeString = isDelivered
    ? `Delivered on ${formatDateTime(deliveredAt)}`
    : `Placed on ${formatDateTime(placedAt)}`;

  return (
    <div className="order-card">
      {/* Top Row */}
      <div className="order-card-top">
        <h3 className="order-card-restaurant">{restaurantName}</h3>
        <div className="order-card-top-right">
          <OrderStatusBadge status={status} />
          <span className="order-card-amount">₹{totalAmount}</span>
        </div>
      </div>

      {/* Body */}
      <div className="order-card-body">
        <p className="order-card-items">{itemSummary}</p>
        <p className="order-card-id">Order ID: {id}</p>
        <p className="order-card-date">{dateTimeString}</p>
        <p className="order-card-address">{addressShort}</p>
      </div>

      {/* Actions */}
      <div className="order-card-actions">
        {isOngoing && (
          <>
            <button className="order-btn-primary">Track Order</button>
            <button className="order-btn-secondary">Cancel Order</button>
          </>
        )}
        {isDelivered && (
          <>
            <button className="order-btn-primary">Reorder</button>
            <button className="order-btn-secondary">View Invoice</button>
            <button className="order-btn-text">Need help?</button>
          </>
        )}
        {status === 'CANCELLED' && (
          <button className="order-btn-primary">Order Again</button>
        )}
      </div>
    </div>
  );
}
