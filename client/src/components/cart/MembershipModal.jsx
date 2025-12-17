import React from 'react';

export default function MembershipModal({ isOpen, onClose, onApply }) {
  if (!isOpen) return null;
  const plan = { id: 'EATCLUB-PLUS', name: 'EatClub Plus', price: 199 };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 340 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Join EATCLUB</div>
        <div style={{ color: '#333', marginBottom: 12 }}>Save on delivery, surge and more.</div>
        <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{plan.name}</div>
            <div style={{ color: '#777', fontSize: 13 }}>₹{plan.price} / month</div>
          </div>
          <button className="btn-primary" onClick={() => onApply && onApply(plan)}>Activate</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
