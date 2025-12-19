import React from 'react';

const STATUS_CONFIG = {
  PLACED: { label: 'Placed', key: 'placed' },
  PAID: { label: 'Paid', key: 'paid' },
  PREPARING: { label: 'Preparing', key: 'preparing' },
  READY_FOR_PICKUP: { label: 'Ready for pickup', key: 'ready' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', key: 'out-for-delivery' },
  DELIVERED: { label: 'Delivered', key: 'delivered' },
  CANCELLED: { label: 'Cancelled', key: 'cancelled' },
};

export default function OrderStatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();
  const config = STATUS_CONFIG[normalized] || { label: 'Unknown', key: 'unknown' };

  return (
    <span className={`order-status-badge order-status-badge--${config.key}`}>
      {config.label}
    </span>
  );
}
