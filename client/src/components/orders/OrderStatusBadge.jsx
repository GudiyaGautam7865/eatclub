import React from 'react';
const STATUS_CONFIG = {
  PLACED: { label: 'Placed', key: 'placed' },
  PREPARING: { label: 'Preparing', key: 'preparing' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', key: 'out-for-delivery' },
  DELIVERED: { label: 'Delivered', key: 'delivered' },
  CANCELLED: { label: 'Cancelled', key: 'cancelled' },
};

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: 'Unknown', key: 'unknown' };

  return (
    <span className={`order-status-badge order-status-badge--${config.key}`}>
      {config.label}
    </span>
  );
}
