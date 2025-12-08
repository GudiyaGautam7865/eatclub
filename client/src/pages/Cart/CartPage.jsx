import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";
import ScheduleModal from "../../components/cart/ScheduleModal.jsx";
import AddressMapModal from "../../components/cart/AddressMapModal.jsx";
import AddressFormModal from "../../components/cart/AddressFormModal.jsx";
import PaymentResult from "../../components/cart/PaymentResult.jsx";
import CouponModal from "../../components/cart/CouponModal.jsx";
import CouponAppliedModal from "../../components/cart/CouponAppliedModal.jsx";
import MembershipModal from "../../components/cart/MembershipModal.jsx";
import { useCartContext } from '../../context/CartContext.jsx';
import { useAddressContext } from '../../context/AddressContext.jsx';
import { createOrderFromCart } from '../../services/ordersService.js';

export default function CartPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState("");
  const [activeSection, setActiveSection] = useState("time");
  const [mapOpen, setMapOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState('');
  const [paymentTab, setPaymentTab] = useState('UPI');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentResult, setShowPaymentResult] = useState(false);

  const navigate = useNavigate();
  const { addresses, selectedAddress, selectAddress } = useAddressContext();

  // use cart context for persistent cart state
  const {
    items,
    incQty,
    decQty,
    removeItem,
    hasMembership,
    hideMembership,
    showMembership,
    appliedCoupon,
    appliedSavings,
    applyCoupon,
    removeCoupon,
    itemsCount,
    total,
  } = useCartContext();

  const cartCount = itemsCount;
  const cartTotal = total;

  const handlePay = () => {
    // Create order from current cart
    if (items.length > 0 && selectedAddress) {
      try {
        const addressShort = selectedAddress.address?.split(',')[0] || selectedAddress.label || 'Delivery Address';
        createOrderFromCart(items, cartTotal, addressShort);

        // Clear the cart by removing all items
        items.forEach(item => {
          if (item.qty > 0) {
            removeItem(item.id);
          }
        });

        // Navigate to manage orders page
        navigate('/manage_orders');
      } catch (error) {
        console.error('Error creating order:', error);
        // Fallback: still show payment result on error
        setActiveSection("");
        setSelectedPayment(null);
        setScheduledSlot("");
        setShowPaymentResult(true);
      }
    } else {
      // If no items or no address, just show payment result as before
      setActiveSection("");
      setSelectedPayment(null);
      setScheduledSlot("");
      setShowPaymentResult(true);
    }
  };

  const addressRef = React.createRef();
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponAppliedOpen, setCouponAppliedOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);

  const openSchedule = () => setIsModalOpen(true);
  const closeSchedule = () => setIsModalOpen(false);
  const openMap = () => setMapOpen(true);
  const closeMap = () => setMapOpen(false);
  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const handleSchedule = (slot) => {
    setScheduledSlot(slot);
    setIsModalOpen(false);
  };

  const handleToggleDeliverNow = () => {
    // if already scheduled, toggling to Deliver Now clears the scheduled slot
    if (scheduledSlot) setScheduledSlot("");
  };

  const handleConfirmLocation = (locationString) => {
    setPendingLocation(locationString);
    setMapOpen(false);
    setTimeout(() => setFormOpen(true), 80);
  };

  // recompute cart count and total when items/membership/appliedSavings change
  // inc/dec handled by context (incQty/decQty). removeItem available for explicit removals.

  return (
    <div className="cart-page page-container">
      <div className="cart-grid">
        <div className="cart-left">
          
          <div className="card account-card">
            <div className="card-title">Account</div>
            <div className="card-body">Vivek | 9767996768</div>
          </div>

          <div className={`card delivery-time-card ${activeSection === "time" ? "active" : ""}`}>
            <div className="card-title">
              <span className="dot">🕒 Delivery Time </span>
              {/* top-right link: toggles between schedule and deliver now */}
              {!scheduledSlot ? (
                <a className="schedule-link" href="#" onClick={(e)=>{e.preventDefault(); openSchedule();}}>Schedule for Later</a>
              ) : (
                <a className="schedule-link" href="#" onClick={(e)=>{e.preventDefault(); handleToggleDeliverNow();}}>Deliver Now</a>
              )}
            </div>
            <div className="card-body delivery-body">
              <div>
                {!scheduledSlot ? (
                  <div className="delivery-now">Deliver Now <span className="muted">with live tracking ⚡</span></div>
                ) : (
                  <div className="delivery-later">Deliver Later <span className="muted">{scheduledSlot}</span> <a className="change-slot" href="#" onClick={(e)=>{e.preventDefault(); openSchedule();}}>Change Slot</a></div>
                )}
              </div>
              <button
                className="btn-primary"
                onClick={() => {
                  // expand delivery address section
                  setActiveSection("address");
                  // scroll into view if available
                  setTimeout(() => {
                    if (addressRef && addressRef.current) addressRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 80);
                }}
              >
                Continue
              </button>
            </div>
          </div>

          <div className={`card delivery-address-card ${activeSection === "address" ? "expanded active" : ""}`} ref={addressRef}>
            <div className="card-title">Delivery Address
              <button className="add-address" onClick={(e)=>{e.preventDefault(); openMap();}}>Add Address</button>
            </div>

            {activeSection !== "address" ? (
              <div className="card-body muted">Add or select a delivery address</div>
            ) : (
              <div className="card-body address-grid">
                {addresses.map((a) => (
                  <div key={a.id} className={`addr-card ${selectedAddress?.id === a.id ? "selected" : ""}`} onClick={() => selectAddress(a.id)}>
                    <div className="addr-label">{a.label}</div>
                    <div className="addr-title">{a.address?.split(',')[0] || a.label}</div>
                    <div className="addr-text">{a.address}</div>
                  </div>
                ))}

                <div className="address-actions">
                  <button className="btn-primary" onClick={() => { setActiveSection("payment"); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>
                    PROCEED TO PAYMENT
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`card payment-card ${activeSection === "payment" ? "active" : ""}`}>
            <div className="card-title">Payment</div>
            {activeSection !== "payment" ? (
              <div className="card-body muted">Choose a payment method</div>
            ) : (
              <div className="card-body payment-inner">
                <nav className="payment-nav">
                {['UPI','Cards & Meal Cards','Pay Later','CRED Pay','Net Banking','Cash'].map(tab=> (
                  <div key={tab} className={`payment-nav-item ${paymentTab===tab? 'active' : ''}`} onClick={()=>setPaymentTab(tab)}>
                    {tab}
                    {['Pay Later','CRED Pay'].includes(tab) && <span className="badge">✔</span>}
                  </div>
                ))}
              </nav>

              <div className="payment-content">
                {paymentTab === 'UPI' && (
                  <div>
                    <div className={`pay-option ${selectedPayment==='gpay'?'selected':''}`} onClick={()=>setSelectedPayment('gpay')}>
                      <div className="pay-left"><img src="/src/assets/images/payments/google-pay.svg" alt="gpay" className="pay-logo"/> Google Pay</div>
                      <div className="pay-right"><input type="radio" name="pay" checked={selectedPayment==='gpay'} readOnly/></div>
                      <div className="pay-sub">MOBILE NUMBER <input className="mini-input" value="9767996768" readOnly/></div>
                    </div>

                    <div className={`pay-option ${selectedPayment==='paytm'?'selected':''}`} onClick={()=>setSelectedPayment('paytm')}>
                      <div className="pay-left"><img src="/src/assets/images/payments/paytm.svg" alt="paytm" className="pay-logo"/> Paytm UPI</div>
                      <div className="pay-right"><input type="radio" name="pay" checked={selectedPayment==='paytm'} readOnly/></div>
                    </div>

                    <div className="pay-add"> <button className="btn-add">Add New UPI ID</button> </div>
                  </div>
                )}

                {paymentTab === 'Cards & Meal Cards' && (
                  <div>
                    <div className="pay-card-box">Add New Debit/Credit Card <button className="link">ADD</button></div>
                    <div className="pay-card-box">Add Pluxee | Sodexo <button className="link">ADD</button></div>
                  </div>
                )}

                {paymentTab === 'Pay Later' && (
                  <div>
                    <div className={`pay-option ${selectedPayment==='lazypay'?'selected':''}`} onClick={()=>setSelectedPayment('lazypay')}>
                      <div className="pay-left">LazyPay</div>
                      <div className="pay-right"><input type="radio" name="pay" checked={selectedPayment==='lazypay'} readOnly/></div>
                      <div className="pay-desc">Assured ₹20-₹150 CB for new users | MOV ₹249 | Valid till 31st Dec</div>
                    </div>
                  </div>
                )}

                {paymentTab === 'CRED Pay' && (
                  <div>
                    <div className="pay-disabled">CRED Pay<br/><small>Not eligible for payment.</small></div>
                  </div>
                )}

                {paymentTab === 'Net Banking' && (
                  <div>
                    <div className="bank-grid">
                      {['SBI','HDFC','ICICI','CANARA','AXIS'].map(b=> (
                        <div key={b} className={`bank-tile ${selectedPayment===b?'selected':''}`} onClick={()=>setSelectedPayment(b)}>{b}</div>
                      ))}
                    </div>
                    <div style={{marginTop:18}}>
                      <select className="bank-select"><option>Select other bank</option></select>
                    </div>
                  </div>
                )}

                {paymentTab === 'Cash' && (
                  <div>
                    <div className={`pay-option ${selectedPayment==='cod'?'selected':''}`} onClick={()=>setSelectedPayment('cod')}>
                      <div className="pay-left">Cash on Delivery</div>
                      <div className="pay-right"><input type="radio" name="pay" checked={selectedPayment==='cod'} readOnly/></div>
                    </div>
                    <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
                      <button className="btn-primary pay-cta" onClick={handlePay}>Pay ₹{cartTotal}</button>
                    </div>
                  </div>
                )}
              </div>
              {/* generic pay CTA for all tabs: */}
              <div className="pay-footer">
                <button className="btn-primary pay-cta" onClick={handlePay}>Pay ₹{cartTotal}</button>
              </div>
              </div>)}
          </div>
        </div>

          <aside className="cart-right">
          <div className="sidebar">
            {cartTotal > 0 && (
              <div className="minbar">Add items worth <strong>₹140</strong> more to checkout</div>
            )}

            <div className="cart-summary">
              <div className="cart-summary-header">
                  <span className="label">YOUR <strong>CART</strong></span>
                  <span className="count">{cartCount} ITEM{cartCount !== 1 ? 'S' : ''} | Rs. {cartTotal}</span>
              </div>

                {appliedCoupon && (
                  <div className="coupon-banner">Congrats! You've saved <strong>₹{appliedSavings}</strong> with <span className="code">{appliedCoupon.code || appliedCoupon}</span></div>
                )}

                {hasMembership ? (
                  <div className="cart-item membership">
                    <div className="membership-left">EATCLUB {appliedCoupon ? '6 Months' : '12 Months'} Membership</div>
                    <div className="membership-right">{appliedCoupon ? 'FREE' : '₹9'} { !appliedCoupon && <span className="old">₹199</span> }</div>
                    <a className="change-plan" href="#" onClick={(e)=>{e.preventDefault(); setMembershipOpen(true);}}>Change Plan</a>
                    <button className="remove" onClick={() => {
                      // remove membership persistently and clear applied coupon/banner
                      hideMembership();
                      removeCoupon();
                    }}>REMOVE</button>
                  </div>
                ) : (
                  <div className="cart-item membership add-membership-inline">
                    <button className="btn-secondary" onClick={()=>setMembershipOpen(true)}>Add membership</button>
                  </div>
                )}
                {/* render food items list */}
                {items.filter(it => it.qty > 0).length > 0 && (
                  <div className="food-section">
                    {items.filter(it => it.qty > 0).map(it => (
                      <div className="cart-item food" key={it.id}>
                        <div className="food-left">
                          <div className="food-section-title">{it.section}</div>
                          <div className="food-title">{it.title}</div>
                        </div>
                        <div className="food-right">
                          <div className="food-price"><span className="old">₹{it.oldPrice}</span> <strong>₹{it.price}</strong></div>
                          <div className="qty-control">
                            <button className="qty-btn" onClick={()=>decQty(it.id)}>-</button>
                            <span className="qty-val">{it.qty}</span>
                            <button className="qty-btn" onClick={()=>incQty(it.id)}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="coupon card small">
                <div className="card-title">APPLY COUPON</div>
                <div className="card-body">
                  {!appliedCoupon ? (
                    <button className="btn-secondary" onClick={()=>setCouponOpen(true)}>Apply Coupon</button>
                  ) : (
                    <div className="applied-coupon-row">
                      <div className="applied-code">{appliedCoupon.code || appliedCoupon}</div>
                      <button className="btn-remove" onClick={() => { removeCoupon(); }}>REMOVE</button>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="coupon-desc">Join EATCLUB & save 30% EVERYTIME. No Delivery/Packaging/Surge Fees.</div>
                  )}
                </div>
            </div>

            <div className="bill card small">
              <div className="card-title">BILL DETAILS</div>
              <div className="bill-row">
                <span>To Pay</span>
                <strong>₹{cartTotal}</strong>
              </div>
              {appliedCoupon && (
                <div className="saved saved-green">Congrats! You have saved <strong>₹{appliedSavings}</strong> on this order</div>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && (
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
              <button className="btn-secondary" onClick={()=>{ localStorage.removeItem('eatclub_cart_v1'); window.location.reload(); }}>Reset sample cart</button>
            </div>
          )}
          </div>
        </aside>
      </div>
        <ScheduleModal isOpen={isModalOpen} onClose={closeSchedule} onSchedule={handleSchedule} initial={scheduledSlot} />
        <AddressMapModal isOpen={mapOpen} onClose={closeMap} onConfirm={handleConfirmLocation} />
        <AddressFormModal isOpen={formOpen} onClose={closeForm} initialAddress={pendingLocation} />
        <PaymentResult open={showPaymentResult} onClose={()=>setShowPaymentResult(false)} method={selectedPayment} amount={cartTotal} />
        <CouponModal isOpen={couponOpen} onClose={()=>setCouponOpen(false)} onApply={(c)=>{ applyCoupon(c); setCouponOpen(false); setCouponAppliedOpen(true); }} />
        <CouponAppliedModal open={couponAppliedOpen} onClose={()=>setCouponAppliedOpen(false)} code={appliedCoupon?.code || appliedCoupon} />
        <MembershipModal isOpen={membershipOpen} onClose={()=>setMembershipOpen(false)} onApply={(plan)=>{ setMembershipOpen(false); /* enable membership */ showMembership(); }} />

        {/* Page-level fixed pay footer (visible on payment step) */}
        {activeSection === 'payment' && (
          <div className="page-pay-footer">
            <div className="pay-bar">
              <div className="pay-summary">To Pay <strong>₹{cartTotal}</strong></div>
              <div className="pay-actions">
                <button className="pay-cta page-pay-button" onClick={()=>setShowPaymentResult(true)}>Pay ₹{cartTotal}</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
