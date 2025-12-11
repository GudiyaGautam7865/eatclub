import React from 'react';
import './OrderTracking.css';

export default function OrderTracking({ status, orderDate }) {
  const steps = [
    { key: 'placed', label: 'Order Placed', icon: '📝' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'outfordelivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'completed', label: 'Delivered', icon: '✅' }
  ];

  const getStepStatus = (stepKey) => {
    const statusOrder = ['placed', 'preparing', 'outfordelivery', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (status === 'cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
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
              {idx === 0 && <div className="step-time">{new Date(orderDate).toLocaleString()}</div>}
            </div>
            {idx < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
