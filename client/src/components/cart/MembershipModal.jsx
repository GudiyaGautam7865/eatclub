import React, { useState, useEffect } from 'react';
import './MembershipModal.css';

export default function MembershipModal({ isOpen, onClose, onApply }) {
  const [selected, setSelected] = useState('free');

  useEffect(()=>{
    if(!isOpen) setSelected('free');
  },[isOpen]);

  if (!isOpen) return null;

  return (
    <div className="membership-modal-overlay">
      <div className="membership-modal">
        <button className="mm-close" onClick={onClose}>×</button>
        <div className="mm-header">
          <div className="mm-sub">Select Your</div>
          <h2 className="mm-title">EatClub Membership</h2>
        </div>

        <div className="mm-features">
          <ul>
            <li>No HIDDEN fees EVER</li>
            <li>Save 30% Everytime</li>
            <li>Handpicked brands ONLY</li>
          </ul>
        </div>

        <div className="mm-plans">
          <div className={`mm-plan ${selected==='free' ? 'selected' : ''}`} onClick={()=>setSelected('free')}>
            <div className="mm-plan-badge">Already in cart</div>
            <div className="mm-plan-price">FREE</div>
            <div className="mm-plan-duration">6 months</div>
            <div className="mm-plan-check">{selected==='free' ? '●' : ''}</div>
          </div>

          <div className={`mm-plan ${selected==='paid' ? 'selected' : ''}`} onClick={()=>setSelected('paid')}>
            <div className="mm-plan-price">₹ 9</div>
            <div className="mm-plan-old">₹199</div>
            <div className="mm-plan-duration">12 months</div>
            <div className="mm-plan-check">{selected==='paid' ? '●' : ''}</div>
          </div>
        </div>

        <div className="mm-cta">
          <button className="mm-apply" onClick={()=>{ onApply && onApply(selected); }}>
            Apply EatClub and Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
