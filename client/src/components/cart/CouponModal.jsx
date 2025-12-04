import React from 'react';
import './CouponModal.css';

export default function CouponModal({ isOpen, onClose, onApply }) {
  if (!isOpen) return null;

  const coupons = [
    { code: 'EATCLUB', title: 'Flat 30% Off + Zero Delivery/Packaging Fees', note: 'For EatClub members only.', save: 161 },
    { code: 'FIRST3', title: 'Flat 20% Off up to ₹50', note: 'For new users', save: 50 }
  ];

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal" onClick={e=>e.stopPropagation()}>
        <button className="cm-close" onClick={onClose}>×</button>
        <h3>APPLY COUPON CODE</h3>

        <div className="cm-enter">
          <input placeholder="Enter Coupon Code" />
          <button className="cm-apply">APPLY</button>
        </div>

        <h4>Or choose from below</h4>
        <div className="cm-list">
          {coupons.map(c => (
            <div className="cm-card" key={c.code}>
              <div className="cm-left">
                <div className="cm-logo">{c.code}</div>
                <div className="cm-info">
                  <div className="cm-title">{c.title}</div>
                  <div className="cm-note">{c.note}</div>
                  <div className="cm-save">You will save ₹{c.save} with this code</div>
                </div>
              </div>
              <div className="cm-action">
                <button className="cm-apply-btn" onClick={()=>onApply(c)}>APPLY</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
