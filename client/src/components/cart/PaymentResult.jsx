import React from 'react';

export default function PaymentResult({ open, onClose, method, amount }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 320, textAlign: 'center' }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Payment Result</div>
        <div style={{ color: '#333', marginBottom: 12 }}>Method: {method || '—'}</div>
        <div style={{ color: '#333', marginBottom: 12 }}>Amount: ₹{amount || 0}</div>
        <button className="btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
