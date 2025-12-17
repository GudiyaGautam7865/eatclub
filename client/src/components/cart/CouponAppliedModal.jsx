import React from 'react';

export default function CouponAppliedModal({ open, onClose, code }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 300, textAlign: 'center' }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Coupon Applied</div>
        <div style={{ color: '#333', marginBottom: 12 }}>Code: {code}</div>
        <button className="btn-primary" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
