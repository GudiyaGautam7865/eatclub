import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useCartContext } from "../../../context/CartContext";
import { useUserContext } from "../../../context/UserContext";
import { useAddressContext } from "../../../context/AddressContext";
import MembershipModal from "../../cart/MembershipModal.jsx";
import AddressDropdown from "./AddressDropdown";

function Header() {
  const navigate = useNavigate();
  const {
    items,
    addItem,
    incQty,
    decQty,
    removeItem: removeFromCart,
    itemsCount,
    itemsTotal,
    hasMembership,
    hideMembership,
    showMembership,
  } = (() => {
    try {
      return useCartContext();
    } catch (e) {
      return {
        items: [],
        addItem: () => {},
        incQty: () => {},
        decQty: () => {},
        removeItem: () => {},
        itemsCount: 0,
        itemsTotal: 0,
        hasMembership: false,
        hideMembership: () => {},
        showMembership: () => {},
      };
    }
  })();

  const { user, isLoggedIn } = (() => {
    try {
      return useUserContext();
    } catch (e) {
      return { user: null, isLoggedIn: false };
    }
  })();

  const { selectedAddress } = (() => {
    try {
      return useAddressContext();
    } catch (e) {
      return { selectedAddress: null };
    }
  })();

  const displayAddress = selectedAddress?.label || selectedAddress?.address || "Enter Delivery Location";

  const [addressOpen, setAddressOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const addressRef = useRef(null);
  const dealsRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const signupRef = useRef(null);

  // Filter items with qty > 0
  const cartItems = items.filter((it) => it.qty > 0);
  const cartCount = itemsCount;
  const subtotal = itemsTotal;

  const [signedUpUser, setSignedUpUser] = useState(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function onDocClick(e) {
      if (addressRef.current && !addressRef.current.contains(e.target)) {
        setAddressOpen(false);
      }
      if (dealsRef.current && !dealsRef.current.contains(e.target)) {
        setDealsOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Close signup modal on click outside
  useEffect(() => {
    function onDocClick(e) {
      if (signupOpen && signupRef.current && !signupRef.current.contains(e.target)) {
        const overlay = e.target.classList.contains('ec-modal-overlay');
        if (overlay) setSignupOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [signupOpen]);

  // Keyboard navigation
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        if (signupOpen) setSignupOpen(false);
        else if (addressOpen) setAddressOpen(false);
        else if (dealsOpen) setDealsOpen(false);
        else if (cartOpen) setCartOpen(false);
        else if (profileOpen) setProfileOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [signupOpen, addressOpen, dealsOpen, cartOpen, profileOpen]);

  function openOnly(toggleFn) {
    setAddressOpen(false);
    setDealsOpen(false);
    setCartOpen(false);
    setProfileOpen(false);
    toggleFn();
  }

  function openSignup() {
    setSignupOpen(true);
    setProfileOpen(false);
  }

  function closeSignup() {
    setSignupOpen(false);
    setPhoneNumber("");
    setShowAdminLogin(false);
    setAdminUsername("");
    setAdminPassword("");
    setAdminError("");
  }

  function handleContinue() {
    if (phoneNumber.length >= 10) {
      console.log('Continue with phone:', phoneNumber);
      // Simulate user signup with phone
      const userName = "User";
      setSignedUpUser({
        name: userName,
        phone: phoneNumber,
        avatar: userName.charAt(0).toUpperCase()
      });
      closeSignup();
    }
  }

  function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  }

  function handlePhoneChange(e) {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  }

  function handleGoogleSignup() {
    console.log('Sign up with Google');
    // Simulate user signup - in real app, this would come from backend
    setSignedUpUser({
      name: "username",
      phone: phoneNumber || "+91-XXXXXXXXXX",
      avatar: "V"
    });
    closeSignup();
  }

  function toggleAddress(e) {
    e.stopPropagation();
    openOnly(() => setAddressOpen((s) => !s));
  }
  function toggleDeals(e) {
    e.stopPropagation();
    openOnly(() => setDealsOpen((s) => !s));
  }
  function toggleCart(e) {
    e.stopPropagation();
    openOnly(() => setCartOpen((s) => !s));
  }
  function toggleProfile(e) {
    e.stopPropagation();
    openOnly(() => setProfileOpen((s) => !s));
  }

  function changeQty(id, delta) {
    if (delta > 0) {
      incQty(id);
    } else if (delta < 0) {
      decQty(id);
    }
  }

  function toggleMembership() {
    if (hasMembership) {
      hideMembership();
    } else {
      showMembership();
    }
  }

  function scrollToFooter() {
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
  }

  const handleProceedToCart = () => {
    setCartOpen(false);
    window.scrollTo(0, 0);
    navigate("/cart");
  };

  return (
    <header className="ec-header">
      <div className="ec-header-inner">
        <div className="ec-left">
          <Link to="/" className="ec-logo">
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/logo.png" alt="EatClub Logo" />
          </Link>

          <div
            className="ec-address-pill"
            ref={addressRef}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={addressOpen}
            onClick={toggleAddress}
            onKeyDown={(e) => e.key === "Enter" && toggleAddress(e)}
          >
            <span className="ec-mode">DELIVERY</span>
            <span className="ec-address-text">{displayAddress}</span>
            <span className="ec-caret">▾</span>
            {addressOpen && (
              <AddressDropdown
                onClose={() => setAddressOpen(false)}
              />
            )}
          </div>
        </div>

        <nav className="ec-nav">
          <Link to="/membership" className="ec-nav-item">
            Why EatClub?
          </Link>

          <div className="ec-nav-item ec-deals" ref={dealsRef}>
            <button
              className="ec-deals-button"
              onClick={toggleDeals}
              aria-haspopup="true"
              aria-expanded={dealsOpen}
              aria-label="Deals and offers menu"
            >
              Deals <span className="ec-caret" aria-hidden="true">▾</span>
            </button>
            {dealsOpen && (
              <div className="ec-deals-menu" role="menu">
                <Link to="/refer" className="ec-deals-item">
                  Refer & Earn
                </Link>
                <Link to="/party_order" className="ec-deals-item">
                  Bulk Order
                </Link>
                <Link to="/offers" className="ec-deals-item">
                  Offers
                </Link>
              </div>
            )}
          </div>

          <div className="ec-nav-item ec-cart" ref={cartRef}>
            <button
              className="ec-cart-button"
              onClick={toggleCart}
              aria-haspopup="true"
              aria-expanded={cartOpen}
              aria-label={`Shopping cart with ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              title={`Open cart (${cartCount} items)`}
            >
              <span className="ec-cart-icon" aria-hidden="true">🛒</span>
              <span className="ec-cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="ec-cart-badge" aria-label={`${cartCount} item${cartCount !== 1 ? 's' : ''}`}>{cartCount}</span>
              )}
            </button>

            {cartOpen && (
              <div className="ec-cart-dropdown" role="dialog" aria-label="Cart">
                {hasMembership ? (
                  <div className="ec-cart-membership">
                    <div className="ec-membership-left">
                      <div className="ec-membership-logo">EATCLUB</div>
                      <div className="ec-membership-info">
                        <div className="ec-membership-title">EATCLUB 12 Months</div>
                        <div className="ec-membership-sub">Membership</div>
                      </div>
                    </div>
                    <div className="ec-membership-right">
                      <div className="ec-membership-old">₹199</div>
                      <div className="ec-membership-price">₹9</div>
                      <a className="change-plan" href="#" onClick={(e)=>{e.preventDefault(); setMembershipOpen(true);}}>Change Plan</a>
                      <button className="ec-remove" onClick={toggleMembership}>REMOVE</button>
                    </div>
                  </div>
                ) : (
                  <div className="ec-cart-membership add-membership-inline">
                    <button
                      className="ec-cta"
                      style={{ backgroundColor: "#fff", color: "#d60036", border: "1px solid #e0e0e0" }}
                      onClick={()=>setMembershipOpen(true)}
                    >
                      Add membership
                    </button>
                  </div>
                )}


                <div className="ec-cart-items">
                  {cartItems.length === 0 ? (
                    <div className="ec-cart-empty">
                      <div className="ec-empty-icon">🛒</div>
                      <div className="ec-empty-text">Your cart is empty</div>
                    </div>
                  ) : (
                    cartItems.map((it) => (
                      <div className="ec-cart-item" key={it.id}>
                        <div className="ec-item-left">
                          <div className="ec-item-brand">{it.section || it.brand || "Food Item"}</div>
                          <div className="ec-item-name">{it.title || it.name}</div>
                        </div>
                        <div className="ec-item-right">
                          <div className="ec-item-price">
                            <span className="ec-old">₹{it.oldPrice || it.price}</span>
                            <span className="ec-new">₹{it.price}</span>
                          </div>
                          <div className="ec-qty">
                            <button 
                              onClick={(e) => { e.stopPropagation(); changeQty(it.id, -1); }} 
                              aria-label={`Decrease ${it.title} quantity`}
                              title="Decrease quantity"
                            >-</button>
                            <span>{it.qty}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); changeQty(it.id, 1); }}
                              aria-label={`Increase ${it.title} quantity`}
                              title="Increase quantity"
                            >+</button>
                          </div>
                          <button 
                            className="ec-item-remove"
                            onClick={(e) => { e.stopPropagation(); removeFromCart(it.id); }}
                            aria-label="remove item"
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="ec-cart-footer">
                  {cartItems.length > 0 ? (
                    <>
                      <div className="ec-subtotal">Subtotal <span>₹{Math.round(subtotal)}</span></div>
                      <button 
                        className="ec-cta" 
                        onClick={handleProceedToCart}
                        style={{ border: 'none', cursor: 'pointer', width: '100%', padding: '10px', backgroundColor: '#d60036', color: '#fff' }}
                      >
                        Proceed To Cart
                      </button>
                    </>
                  ) : (
                    <Link to="/menu" className="ec-cta ec-cta-empty">Start Shopping</Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            className="ec-get-app-button" 
            onClick={scrollToFooter}
            aria-label="Download EatClub mobile app"
            title="Scroll to download app section"
          >
            Get the app
          </button>

          <div className="ec-nav-item ec-profile" ref={profileRef}>
            {!signedUpUser ? (
              <button
                className="ec-signup-button"
                onClick={openSignup}
                aria-haspopup="true"
              >
                Sign Up
              </button>
            ) : (
              <>
                <button
                  className="ec-profile-button"
                  onClick={toggleProfile}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  <div className="ec-profile-avatar">{signedUpUser.avatar}</div>
                  <span>{signedUpUser.name}</span>
                  <span className="ec-caret">▾</span>
                </button>

                {profileOpen && (
                  <div className="ec-profile-menu" role="menu">
                    <Link to="/profile" className="ec-profile-item">My Profile</Link>
                    <Link to="/manage_orders" className="ec-profile-item">Manage Orders</Link>
                    <Link to="/refer" className="ec-profile-item">Refer & Earn</Link>
                    <Link to="/profile/credits" className="ec-profile-item">Credits</Link>
                    <div className="ec-profile-divider" />
                    <button
                      className="ec-profile-item ec-signout"
                      onClick={() => { 
                        console.log('Sign out clicked');
                        setSignedUpUser(null);
                        setProfileOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
      </div>

      <MembershipModal
        isOpen={membershipOpen}
        onClose={() => setMembershipOpen(false)}
        onApply={() => {
          showMembership();
          setMembershipOpen(false);
        }}
      />

      {/* Signup Modal */}
      {signupOpen && (
        <div className="ec-modal-overlay" onClick={closeSignup}>
          <div className="ec-signup-modal" ref={signupRef} onClick={(e) => e.stopPropagation()}>
            <button className="ec-modal-close" onClick={closeSignup}>
              ×
            </button>
            
            <div className="ec-modal-content">
              {!showAdminLogin ? (
                <>
                  <h2 className="ec-modal-title">SIGN UP</h2>
                  
                  <div className="ec-phone-section">
                    <label className="ec-phone-label">Phone Number*</label>
                    <input
                      type="tel"
                      className="ec-phone-input"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Enter your phone number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                  
                  <button 
                    className="ec-continue-btn"
                    onClick={handleContinue}
                    disabled={phoneNumber.length < 10}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    CONTINUE
                  </button>
                  
                  <button className="ec-google-btn" onClick={handleGoogleSignup} style={{ marginTop: '16px' }}>
                    <div className="ec-google-content">
                      <div className="ec-google-avatar">G</div>
                      <div className="ec-google-text">
                        <div className="ec-google-title">Sign up with Google Account</div>
                        <div className="ec-google-email">Create new account</div>
                      </div>
                    </div>
                  </button>
                  
                  <div style={{ textAlign: 'center', margin: '16px 0', position: 'relative' }}>
                    <div style={{ borderBottom: '1px solid #e0e0e0', position: 'absolute', width: '100%', top: '50%' }}></div>
                    <span style={{ fontSize: '14px', color: '#999', background: '#fff', padding: '0 12px', position: 'relative', zIndex: 1 }}>or</span>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => setShowAdminLogin(true)}
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        border: 'none', 
                        color: '#fff', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: '10px 24px',
                        borderRadius: '6px',
                        boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)',
                        transition: 'transform 0.2s',
                        display: 'inline-block'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      🔒 Admin Login
                    </button>
                  </div>
                  
                  <div className="ec-terms" style={{ marginTop: '15px' }}>
                    By signing up, you agree to the <a href="#">Terms and Conditions</a>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <button 
                      onClick={() => setShowAdminLogin(false)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#d60036', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ← Back to Sign Up
                    </button>
                  </div>
                  
                  <h2 className="ec-modal-title" style={{ marginBottom: '20px' }}>Admin Login</h2>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666', fontWeight: '500' }}>Username</label>
                    <input
                      type="text"
                      className="ec-phone-input"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Enter admin username"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666', fontWeight: '500' }}>Password</label>
                    <input
                      type="password"
                      className="ec-phone-input"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && adminUsername && adminPassword) {
                          if (adminUsername === 'admin' && adminPassword === '1260') {
                            localStorage.setItem('isAdminAuthenticated', 'true');
                            closeSignup();
                            navigate('/admin/dashboard');
                          } else {
                            setAdminError('Invalid username or password');
                          }
                        }
                      }}
                      placeholder="Enter admin password"
                    />
                  </div>
                  
                  {adminError && (
                    <div style={{ padding: '12px', backgroundColor: '#fee', color: '#c00', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
                      {adminError}
                    </div>
                  )}
                  
                  <button 
                    className="ec-continue-btn"
                    onClick={() => {
                      if (adminUsername === 'admin' && adminPassword === '1260') {
                        localStorage.setItem('isAdminAuthenticated', 'true');
                        closeSignup();
                        navigate('/admin/dashboard');
                      } else {
                        setAdminError('Invalid username or password');
                      }
                    }}
                    style={{ backgroundColor: '#333', marginTop: '10px' }}
                  >
                    LOGIN AS ADMIN
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;