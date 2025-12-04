import React from 'react';
import './PaymentResult.css';

export default function PaymentResult({ open, onClose, method, amount }) {
  if (!open) return null;

  return (
    <div className="pr-backdrop" onClick={onClose}>
      <div className="pr-card" onClick={(e)=>e.stopPropagation()}>
        <button className="pr-close" onClick={onClose}>×</button>
        <div className="pr-icon">✅</div>
        <h3 className="pr-title">Payment simulated</h3>
        <p className="pr-msg">Your order was submitted using <strong>{method || 'selected method'}</strong>.</p>
        <p className="pr-amount">Amount: <strong>₹{amount}</strong></p>
        <div style={{textAlign:'center', marginTop:12}}>
          <button className="btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
