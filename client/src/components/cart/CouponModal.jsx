import React, { useState } from 'react';

export default function CouponModal({ isOpen, onClose, onApply }) {
  const [code, setCode] = useState('JOIN30');
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 320 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Apply Coupon</div>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onApply && onApply({ code })}>Apply</button>
        </div>
      </div>
    </div>
  );
}
