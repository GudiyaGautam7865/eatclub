import React from 'react';

export default function CartSummary({
  cartCount = 0,
  cartTotal = 0,
  items = [],
  incQty,
  decQty,
  appliedCoupon,
  appliedSavings = 0,
  hasMembership,
  hideMembership,
  removeCoupon,
  setMembershipOpen,
}) {
  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <div><strong>Your Cart</strong></div>
        <div>{cartCount} items</div>
      </div>

      {hasMembership && (
        <div className="cart-item membership">
          <div className="membership-left">EATCLUB Membership Active</div>
          <div className="membership-right">Saves on every order</div>
          <button className="remove" onClick={hideMembership}>Remove</button>
        </div>
      )}

      {!appliedCoupon && (
        <div className="coupon-banner">
          Save more with EATCLUB. <span className="code">JOIN30</span>
        </div>
      )}

      <div className="food-section">
        <div className="food-section-title">Items</div>
        {items.filter(it => (it?.qty || 0) > 0).map((it) => (
          <div key={it.id} className="cart-item food">
            <div className="food-left">
              <div className="food-title">{it.title || it.name}</div>
              <div className="food-price">₹{it.price || 0}</div>
            </div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => decQty && decQty(it.id)}>-</button>
              <span className="qty-val">{it.qty || 1}</span>
              <button className="qty-btn" onClick={() => incQty && incQty(it.id)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {appliedCoupon && (
        <div className="applied-coupon-row" style={{ marginTop: 10 }}>
          <div className="applied-code">{appliedCoupon.code || appliedCoupon}</div>
          <button className="btn-remove" onClick={removeCoupon}>REMOVE</button>
        </div>
      )}

      <div className="bill card small" style={{ marginTop: 12 }}>
        <div className="card-title">BILL DETAILS</div>
        <div className="bill-row">
          <span>To Pay</span>
          <strong>₹{cartTotal}</strong>
        </div>
        {appliedSavings > 0 && (
          <div className="saved saved-green">Congrats! You have saved <strong>₹{appliedSavings}</strong></div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn-secondary" onClick={() => setMembershipOpen && setMembershipOpen(true)}>Membership</button>
      </div>
    </div>
  );
}
