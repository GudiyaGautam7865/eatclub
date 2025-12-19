import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CartPage.css";
import ScheduleModal from "../../components/cart/ScheduleModal.jsx";
import AddressModal from "../../components/address/AddressModal.jsx";
import PaymentResult from "../../components/cart/PaymentResult.jsx";
import CouponModal from "../../components/cart/CouponModal.jsx";
import CouponAppliedModal from "../../components/cart/CouponAppliedModal.jsx";
import MembershipModal from "../../components/cart/MembershipModal.jsx";
import VerifyAndProceed from "../../components/Payment/VerifyAndProceed.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import DeliveryTimeSelector from "../../components/cart/DeliveryTimeSelector.jsx";
import OrderSuccessAnimation from "../../components/cart/OrderSuccessAnimation.jsx";
import { useCartContext } from '../../context/CartContext.jsx';
import { useAddressContext } from '../../context/AddressContext.jsx';
import { useUserContext } from '../../context/UserContext.jsx';
import { createOrderFromCart } from '../../services/ordersService.js';
import apiClient from '../../services/apiClient.js';
import { createSingleOrder } from '../../services/singleOrdersService.js';
export default function CartPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState("");
  const [activeSection, setActiveSection] = useState("time");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentResult, setShowPaymentResult] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [timeError, setTimeError] = useState('');
  const [addressError, setAddressError] = useState('');

  const navigate = useNavigate();
  const { addresses, selectedAddress, selectAddress, createAddress, updateAddress, deleteAddress, addFromGeolocation } = useAddressContext();
  const { user } = useUserContext();

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

  // Attempt to get current browser location (lat/lng)
  const getCurrentCoords = () => new Promise((resolve) => {
    try {
      if (!navigator.geolocation) return resolve({ lat: 0, lng: 0 });
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 0, lng: 0 }),
        { timeout: 8000, enableHighAccuracy: true }
      );
    } catch {
      resolve({ lat: 0, lng: 0 });
    }
  });

  const parseAddressParts = (addrString) => {
    if (!addrString) return { city: '', pincode: '' };
    const pinMatch = addrString.match(/(\b\d{6}\b)/);
    const pincode = pinMatch ? pinMatch[1] : '';
    // naive city extraction: pick token before state/pincode if available
    const parts = addrString.split(',').map(s => s.trim());
    let city = '';
    if (parts.length >= 2) city = parts[parts.length - 2];
    return { city, pincode };
  };

  const buildOrderPayload = async (payMethod, txId) => {
    if (!selectedAddress?.address) {
      throw new Error('Please select a delivery address');
    }
    const addressLine = selectedAddress.address;
    const { city, pincode } = parseAddressParts(addressLine);
    const coords = await getCurrentCoords();

    return {
      user: user?.id || user?._id || undefined,
      items: (items || []).map((it) => ({
        menuItemId: String(it.id || it.menuItemId || it.title || 'unknown'),
        name: it.title || it.name,
        qty: it.qty || 1,
        price: it.price || 0,
      })),
      total: cartTotal,
      status: payMethod === 'ONLINE' ? 'PAID' : 'PLACED',
      payment: payMethod === 'ONLINE' ? { method: 'ONLINE', txId } : { method: 'COD' },
      address: { line1: addressLine, city, pincode },
      isBulk: false,
      currentLocation: { lat: coords.lat, lng: coords.lng },
    };
  };

  // Validate time slot is not in the past
  const validateTimeSlot = (slot) => {
    if (!slot) return true; // Deliver now is always valid
    
    // Parse the slot (format: "Today, 7:00 PM - 8:00 PM" or similar)
    const timeMatch = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return true; // Can't parse, assume valid
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    
    if (slotTime <= now) {
      setTimeError('Selected time slot is not available');
      return false;
    }
    
    setTimeError('');
    return true;
  };

  // Dynamically load Razorpay checkout script
  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  // Place order using existing backend API and local single orders log
  const placeOrder = async (payMethod, txId) => {
    const orderData = await buildOrderPayload(payMethod, txId);
    let created = null;
    try {
      created = await createOrderFromCart(orderData);
      toast.success('Order placed successfully!', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (e) {
      console.warn('Backend order creation failed, falling back to local log only.', e);
      toast.warning('Order saved locally', {
        position: "top-right",
        autoClose: 2000,
      });
    }

    // Also save to local storage for admin single orders view
    createSingleOrder({
      items: items,
      totalAmount: cartTotal,
      deliveryAddress: orderData?.address?.line1,
      paymentMethod: payMethod,
      date: new Date().toISOString(),
      status: 'Paid',
    });

    // Clear cart
    items.forEach((item) => { if (item.qty > 0) removeItem(item.id); });

    // Show success animation
    setShowSuccessAnimation(true);

    return created;
  };

  // Start Razorpay checkout flow for online payments
  const startOnlinePayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load Razorpay. Please check your internet and try again.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Create payment order on backend
    let createResp;
    try {
      createResp = await apiClient('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: cartTotal }),
      });
      console.log('Razorpay order created:', createResp);
    } catch (error) {
      toast.error('Network error — please try again', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const { order } = createResp || {};
    if (!order?.id) {
      toast.error('Unable to initiate payment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      console.error('Razorpay key missing. Ensure VITE_RAZORPAY_KEY_ID is set in client/.env');
      toast.error('Configuration error: Razorpay key missing', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const rzp = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency || 'INR',
      order_id: order.id,
      name: 'EatClub',
      description: 'Order Payment',
      prefill: {
        name: user?.name || user?.firstName || 'EatClub User',
        contact: user?.phone || user?.phoneNumber || '9999999999',
        email: user?.email || 'customer@eatclub.com',
      },
      theme: { color: '#0b0b0b' },
      handler: async (response) => {
        try {
          const verify = await apiClient('/payment/verify', {
            method: 'POST',
            body: JSON.stringify(response),
          });
          if (verify?.success) {
            await placeOrder('ONLINE', response.razorpay_payment_id);
            // Redirect to success (existing manage_orders view acts as success page)
            return;
          } else {
            toast.error('Payment verification failed. You have not been charged.', {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } catch (e) {
          console.error('Verify payment error', e);
          toast.error('Payment verification failed', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      },
    });

    rzp.on('payment.failed', (resp) => {
      console.error('Razorpay payment failed', resp);
      toast.error('Payment failed — retry or choose COD', {
        position: "top-right",
        autoClose: 3000,
      });
    });

    rzp.open();
  };

  // Handle payment from Verify & Proceed section
  const handlePayFromVerify = async (useCOD) => {
    if (!items?.length || !selectedAddress) {
      toast.error('Please add items and select address', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // When COD selected, bypass Razorpay
    if (useCOD) {
      try {
        await placeOrder('COD');
      } catch (e) {
        console.error('COD order error:', e);
        toast.error('Failed to place COD order', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return;
    }

    // For online payment, directly open Razorpay
    try {
      await startOnlinePayment();
    } catch (e) {
      console.error('Online payment error:', e);
      toast.error('Unable to start payment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const addressRef = React.createRef();
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponAppliedOpen, setCouponAppliedOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);

  const openSchedule = () => setIsModalOpen(true);
  const closeSchedule = () => setIsModalOpen(false);
  const openAddressModal = (addr = null) => { setEditingAddress(addr); setAddressModalOpen(true); };
  const closeAddressModal = () => { setEditingAddress(null); setAddressModalOpen(false); };

  const handleSchedule = (slot) => {
    setScheduledSlot(slot);
    setIsModalOpen(false);
    validateTimeSlot(slot);
  };

  const handleToggleDeliverNow = () => {
    // if already scheduled, toggling to Deliver Now clears the scheduled slot
    if (scheduledSlot) setScheduledSlot("");
  };

  const handleSaveAddress = async (payload) => {
    try {
      setSavingAddress(true);
      const created = editingAddress
        ? await updateAddress(editingAddress.id, payload)
        : await createAddress(payload);
      selectAddress(created.id);
      setAddressError('');
      closeAddressModal();
    } catch (e) {
      toast.error(e?.message || 'Unable to save address', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);
      closeAddressModal();
    } catch (e) {
      toast.error(e?.message || 'Unable to delete address', { position: 'top-right', autoClose: 3000 });
    }
  };

  // recompute cart count and total when items/membership/appliedSavings change
  // inc/dec handled by context (incQty/decQty). removeItem available for explicit removals.

  return (
    <div className="cart-page page-container">
      <ToastContainer />
      {showSuccessAnimation && (
        <OrderSuccessAnimation 
          onComplete={() => {
            setShowSuccessAnimation(false);
            navigate('/manage_orders');
          }}
        />
      )}
      
      <div className="cart-grid">
        <div className="cart-left">
          
          <div className="card account-card">
            <div className="card-title">Account</div>
            <div className="card-body">
              {user?.name || user?.firstName || 'Guest'} | {user?.phone || user?.phoneNumber || 'N/A'}
              <a href="/profile" className="edit-profile-link">Edit Profile</a>
            </div>
          </div>

          <DeliveryTimeSelector
            activeSection={activeSection}
            scheduledSlot={scheduledSlot}
            onOpenSchedule={openSchedule}
            onToggleDeliverNow={handleToggleDeliverNow}
            onContinue={() => {
              if (validateTimeSlot(scheduledSlot)) {
                setActiveSection("address");
                setTimeout(() => {
                  if (addressRef && addressRef.current) {
                    addressRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }, 80);
              }
            }}
            isTimeValid={!timeError}
            timeError={timeError}
          />

          <div className={`card delivery-address-card ${activeSection === "address" ? "expanded active" : ""} ${addressError ? "error-border" : ""}`} ref={addressRef}>
            <div className="card-title">Delivery Address
              <button className="add-address" onClick={(e)=>{e.preventDefault(); openAddressModal();}}>Add Address</button>
            </div>

            {activeSection !== "address" ? (
              <div className="card-body muted">Add or select a delivery address</div>
            ) : (
              <div className="card-body address-grid">
                {addresses.map((a) => (
                  <div key={a.id} className={`addr-card ${selectedAddress?.id === a.id ? "selected" : ""}`}>
                    <div className="addr-card-header">
                      <div onClick={() => { selectAddress(a.id); setAddressError(''); }} style={{ cursor: 'pointer', flex: 1 }}>
                        <div className="addr-label">{a.label}</div>
                        <div className="addr-title">{a.address?.split(',')[0] || a.label}</div>
                        <div className="addr-text">{a.address}</div>
                      </div>
                      <button className="addr-edit-btn" onClick={(e)=>{e.stopPropagation(); openAddressModal(a);}}>Edit</button>
                      <button className="addr-delete-btn" onClick={(e)=>{e.stopPropagation(); handleDeleteAddress(a.id);}}>Delete</button>
                    </div>
                  </div>
                ))}

                {addressError && (
                  <div className="address-error-message">{addressError}</div>
                )}

                <div className="address-actions">
                  <button className="btn-primary" onClick={() => {
                    if (!selectedAddress) {
                      setAddressError('Please select an address to continue');
                      toast.error('Please select an address before continuing', {
                        position: "top-right",
                        autoClose: 3000,
                      });
                      return;
                    }
                    setAddressError('');
                    setActiveSection("verify");
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}>
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Verify & Proceed Section */}
          {activeSection === "verify" && (
            <VerifyAndProceed 
              items={items}
              cartTotal={cartTotal}
              selectedAddress={selectedAddress}
              user={user}
              onPay={handlePayFromVerify}
              appliedSavings={appliedSavings}
              onOnlineSelected={() => {
                // Validate before opening Razorpay immediately
                if (!items?.length) {
                  toast.error('Your cart is empty', { position: 'top-right', autoClose: 3000 });
                  return;
                }
                if (!selectedAddress) {
                  toast.error('Please select an address before continuing', { position: 'top-right', autoClose: 3000 });
                  return;
                }
                startOnlinePayment();
              }}
            />
          )}
        </div>

          <aside className="cart-right">
          <div className="sidebar">
            {cartTotal > 0 && (
              <div className="minbar">Add items worth <strong>₹140</strong> more to checkout</div>
            )}

            <CartSummary
              cartCount={cartCount}
              cartTotal={cartTotal}
              items={items}
              incQty={incQty}
              decQty={decQty}
              appliedCoupon={appliedCoupon}
              appliedSavings={appliedSavings}
              hasMembership={hasMembership}
              hideMembership={hideMembership}
              removeCoupon={removeCoupon}
              setMembershipOpen={setMembershipOpen}
            />

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
        <AddressModal
          isOpen={addressModalOpen}
          onClose={closeAddressModal}
          initialData={editingAddress || {}}
          mode={editingAddress ? 'edit' : 'add'}
          onSave={handleSaveAddress}
          onUseCurrentLocation={addFromGeolocation}
          onDelete={handleDeleteAddress}
        />
        <PaymentResult open={showPaymentResult} onClose={()=>setShowPaymentResult(false)} method={selectedPayment} amount={cartTotal} />
        <CouponModal isOpen={couponOpen} onClose={()=>setCouponOpen(false)} onApply={(c)=>{ applyCoupon(c); setCouponOpen(false); setCouponAppliedOpen(true); }} />
        <CouponAppliedModal open={couponAppliedOpen} onClose={()=>setCouponAppliedOpen(false)} code={appliedCoupon?.code || appliedCoupon} />
        <MembershipModal isOpen={membershipOpen} onClose={()=>setMembershipOpen(false)} onApply={(plan)=>{ setMembershipOpen(false); /* enable membership */ showMembership(); }} />
      
      {/* Mobile sticky proceed button */}
      {activeSection === "address" && (
        <div className="mobile-proceed-button">
          <button onClick={() => {
            if (!selectedAddress) {
              toast.error('Please select an address before continuing', {
                position: "top-center",
                autoClose: 3000,
              });
              return;
            }
            setActiveSection("verify");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
