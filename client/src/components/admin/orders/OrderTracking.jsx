import React from 'react';
import './OrderTracking.css';

export default function OrderTracking({ status, deliveryStatus, orderDate, history = [] }) {
  const normalizedStatus = (status || '').toUpperCase();
  const normalizedDeliveryStatus = (deliveryStatus || '').toUpperCase();

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const diffMinutes = Math.max(0, Math.round((Date.now() - d.getTime()) / 60000));
    const rel = diffMinutes >= 60
      ? `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m ago`
      : `${diffMinutes}m ago`;
    return `${d.toLocaleString()} (${rel})`;
  };

  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: '📝' },
    { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: '📦' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🚚' },
    { key: 'DELIVERED', label: 'Delivered', icon: '✅' }
  ];

  const statusOrder = ['PLACED', 'PAID', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  const getStepStatus = (stepKey) => {
    if (normalizedStatus === 'CANCELLED') return 'cancelled';
    const currentIndex = statusOrder.indexOf(normalizedStatus);
    const stepIndex = statusOrder.indexOf(stepKey);
    if (currentIndex === -1) return 'pending';
    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  const deliveryBadges = {
    ASSIGNED: 'Partner Assigned',
    PICKED_UP: 'Picked Up',
    ON_THE_WAY: 'On the Way',
    DELIVERED: 'Delivered',
  };

  return (
    <div className="order-tracking">
      <h2>Order Tracking</h2>
      <div className="tracking-timeline">
        {steps.map((step, idx) => (
          <div key={step.key} className={`tracking-step ${getStepStatus(step.key)}`}>
            <div className="step-icon">{step.icon}</div>
            <div className="step-content">
              <div className="step-label">{step.label}</div>
              {idx === 0 && orderDate && (
                <div className="step-time">{new Date(orderDate).toLocaleString()}</div>
              )}
              {step.key === 'OUT_FOR_DELIVERY' && normalizedDeliveryStatus && (
                <div className="delivery-substatus">{deliveryBadges[normalizedDeliveryStatus] || normalizedDeliveryStatus}</div>
              )}
            </div>
            {idx < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      {Array.isArray(history) && history.length > 0 && (
        <div className="tracking-history">
          <div className="history-header">
            <h3>History</h3>
            <span className="history-count">{history.length}</span>
          </div>
          <ul className="history-list">
            {history.map((h, idx) => {
              const label = [h.status, h.deliveryStatus].filter(Boolean).join(' / ') || 'Updated';
              return (
                <li key={`${h.timestamp || idx}-${idx}`} className="history-item">
                  <div className="history-dot" />
                  <div className="history-body">
                    <div className="history-top">
                      <span className="history-status">{label}</span>
                      <span className="history-time">{formatTimestamp(h.timestamp)}</span>
                    </div>
                    {h.note && <div className="history-note">{h.note}</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
