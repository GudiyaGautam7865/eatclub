import React from 'react';
import './CustomerCard.css';

export default function CustomerCard({ customer }) {
  return (
    <div className="customer-card">
      <h2>Customer Information</h2>
      <div className="customer-info">
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{customer.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Phone:</span>
          <span className="info-value">{customer.phone}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{customer.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Address:</span>
          <span className="info-value">{customer.address}</span>
        </div>
      </div>
      <div className="customer-actions">
        <a href={`tel:${customer.phone}`} className="action-btn call-btn">
          📞 Call Customer
        </a>
        <a href={`sms:${customer.phone}`} className="action-btn sms-btn">
          💬 Send Message
        </a>
      </div>
    </div>
  );
}
