import React from 'react';

export default function VerifyCustomerInfo({ user }) {
  return (
    <div className="verify-section">
      <h3 className="section-heading">Customer Information</h3>
      <div className="info-grid">
        <div className="info-row">
          <div className="info-label">Name</div>
          <div className="info-value">{user?.name || user?.firstName || 'Guest'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Contact</div>
          <div className="info-value">{user?.phone || user?.phoneNumber || 'N/A'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Email</div>
          <div className="info-value">{user?.email || 'customer@eatclub.com'}</div>
        </div>
      </div>
    </div>
  );
}
