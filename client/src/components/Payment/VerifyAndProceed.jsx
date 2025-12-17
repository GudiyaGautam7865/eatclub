import React, { useState, useRef } from 'react';
import './VerifyAndProceed.css';
import VerifyCustomerInfo from '../cart/VerifyCustomerInfo';
import BillingBreakdown from '../cart/BillingBreakdown';
import { toast } from 'react-toastify';

export default function VerifyAndProceed({ 
  items, 
  cartTotal, 
  selectedAddress, 
  user, 
  onPay,
  appliedSavings = 0,
  onOnlineSelected,
}) {
  const [paymentMode, setPaymentMode] = useState('ONLINE'); // 'ONLINE' | 'COD'
  const openedRef = useRef(false);

  // Calculate billing breakdown
  const itemTotal = cartTotal - appliedSavings;
  const deliveryCharge = 0; // Free delivery
  const taxes = Math.round(itemTotal * 0.05); // 5% GST
  const finalTotal = itemTotal + deliveryCharge + taxes;

  const handlePayClick = () => {
    onPay(paymentMode === 'COD');
  };

  const handleSelectMode = (mode) => {
    setPaymentMode(mode);
    if (mode === 'ONLINE') {
      if (!items?.length) {
        toast.error('Your cart is empty');
        return;
      }
      if (!selectedAddress) {
        toast.error('Please select an address before continuing');
        return;
      }
      // Open Razorpay selection immediately on choosing Online (once)
      if (!openedRef.current && typeof onOnlineSelected === 'function') {
        openedRef.current = true;
        onOnlineSelected();
        // allow reopening if user toggles to COD and back to ONLINE
        setTimeout(() => { openedRef.current = false; }, 1500);
      }
    }
  };

  return (
    <div className="verify-proceed-section">
      <div className="verify-card">
        <h2 className="verify-title">Verify & Proceed</h2>
        
        {/* Customer Information */}
        <VerifyCustomerInfo user={user} />

        {/* Delivery Address */}
        <div className="verify-section">
          <h3 className="section-heading">Delivery Address</h3>
          <div className="address-box">
            <div className="address-label">{selectedAddress?.label || 'Delivery Address'}</div>
            <div className="address-detail">{selectedAddress?.address || 'No address selected'}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="verify-section">
          <h3 className="section-heading">Order Summary</h3>
          <div className="items-list">
            {items.filter(it => it.qty > 0).map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.title || item.name}</span>
                  <span className="item-qty">× {item.qty}</span>
                </div>
                <div className="item-price">₹{(item.price || 0) * (item.qty || 1)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Summary */}
        <BillingBreakdown 
          itemTotal={itemTotal}
          deliveryCharge={deliveryCharge}
          taxes={taxes}
          appliedSavings={appliedSavings}
          finalTotal={finalTotal}
        />

        {/* Payment Mode */}
        <div className="verify-section payment-option-section">
          <div className="payment-mode-group">
            <div 
              className={`mode-card ${paymentMode === 'ONLINE' ? 'selected' : ''}`}
              onClick={() => handleSelectMode('ONLINE')}
            >
              <div className="mode-header">
                <input type="radio" name="paymode" checked={paymentMode==='ONLINE'} readOnly />
                <span className="mode-title">Online Payment</span>
              </div>
              <div className="mode-desc">UPI, Cards, Netbanking, Wallets via Razorpay</div>
              {paymentMode === 'ONLINE' && (
                <div className="mode-hint">Razorpay payment window will open</div>
              )}
            </div>

            <div 
              className={`mode-card ${paymentMode === 'COD' ? 'selected' : ''}`}
              onClick={() => handleSelectMode('COD')}
            >
              <div className="mode-header">
                <input type="radio" name="paymode" checked={paymentMode==='COD'} readOnly />
                <span className="mode-title">Cash on Delivery</span>
              </div>
              <div className="mode-desc">Pay in cash when your order arrives</div>
            </div>
          </div>
        </div>

        {/* Sticky Pay Button */}
        <div className="pay-button-wrapper">
          <button 
            className="pay-now-button" 
            onClick={handlePayClick}
          >
            {paymentMode === 'COD' ? 'Place COD Order' : 'Pay'} ₹{finalTotal}
          </button>
        </div>
      </div>
    </div>
  );
}
