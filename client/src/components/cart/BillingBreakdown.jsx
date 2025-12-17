import React from 'react';

export default function BillingBreakdown({ itemTotal = 0, deliveryCharge = 0, taxes = 0, appliedSavings = 0, finalTotal = 0 }) {
  return (
    <div className="verify-section">
      <h3 className="section-heading">Bill Details</h3>
      <div className="billing-section">
        <div className="billing-rows">
          <div className="billing-row">
            <span>Items Total</span>
            <span>₹{itemTotal}</span>
          </div>
          <div className="billing-row">
            <span>Delivery</span>
            <span className="free-badge">FREE</span>
          </div>
          <div className="billing-row">
            <span>Taxes (GST)</span>
            <span>₹{taxes}</span>
          </div>
          {appliedSavings > 0 && (
            <div className="billing-row savings-row">
              <span>Savings</span>
              <span className="savings-amount">-₹{appliedSavings}</span>
            </div>
          )}
          <div className="billing-row total-row">
            <span>Total</span>
            <span className="total-amount">₹{finalTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
