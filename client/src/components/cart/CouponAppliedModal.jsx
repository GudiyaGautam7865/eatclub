import React from 'react';
import './CouponAppliedModal.css';

export default function CouponAppliedModal({ open, onClose, code }) {
  if (!open) return null;

  return (
    <div className="cam-backdrop" onClick={onClose}>
      <div className="cam-card" onClick={e=>e.stopPropagation()}>
        <div className="cam-icon">✅</div>
        <h3>Yay! <strong>{code}</strong> applied</h3>
        <p>Awesome! Your coupon code has been applied, enjoy good food!</p>
        <div className="cam-divider" />
        <div style={{textAlign:'center'}}>
          <button className="cam-thanks" onClick={()=>{ console.log('Coupon applied:', code); onClose && onClose(); }}>THANKS</button>
        </div>
      </div>
    </div>
  );
}
