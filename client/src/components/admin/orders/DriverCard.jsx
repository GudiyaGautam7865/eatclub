import React from 'react';
import './DriverCard.css';

export default function DriverCard({ driver }) {
  return (
    <div className="driver-card">
      <h2>Driver Information</h2>
      <div className="driver-info">
        <div className="driver-avatar">🚗</div>
        <div className="driver-details">
          <div className="driver-name">{driver.name}</div>
          <div className="driver-id">ID: {driver.id}</div>
          <div className="driver-phone">{driver.phone}</div>
        </div>
      </div>
      <div className="driver-actions">
        <a href={`tel:${driver.phone}`} className="action-btn call-btn">
          📞 Call Driver
        </a>
        <a href={`sms:${driver.phone}`} className="action-btn sms-btn">
          💬 Message Driver
        </a>
      </div>
    </div>
  );
}
