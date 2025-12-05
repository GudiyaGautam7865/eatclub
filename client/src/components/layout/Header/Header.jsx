import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useCartContext } from "../../../context/CartContext";
import { useUserContext } from "../../../context/UserContext";
import AddressDropdown from "./AddressDropdown";

function Header() {
  const navigate = useNavigate();
  const { items } = (() => {
    try {
      return useCartContext();
    } catch (e) {
      return { items: [] };
    }
  })();

  const { user, isLoggedIn } = (() => {
    try {
      return useUserContext();
    } catch (e) {
      return { user: null, isLoggedIn: false };
    }
  })();

  const [selectedAddress, setSelectedAddress] = useState(
    user?.defaultAddress?.label || "Enter Delivery Location"
  );
  const savedAddresses = isLoggedIn ? user?.addresses || [] : [];

  const [addressOpen, setAddressOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      brand: "BOX8 - Desi Meals",
      name: "Dilli Rajma Meal",
      oldPrice: 259,
      price: 181,
      qty: 1,
    },
    {
      id: 2,
      brand: "Mealful Rolls",
      name: "Any 2 Rolls",
      oldPrice: 354,
      price: 252,
      qty: 1,
    },
  ]);

  const cartCount = cartItems?.length ?? 0;

  const [signedUpUser, setSignedUpUser] = useState(null);
  const [membershipAdded, setMembershipAdded] = useState(true);

  const addressRef = useRef(null);
  const dealsRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const signupRef = useRef(null);

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
      name: "Vivek",
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

  function handleAddressSelect(addressText) {
    setSelectedAddress(addressText || "Enter Delivery Location");
    setAddressOpen(false);
  }

  function changeQty(id, delta) {
    setCartItems((cur) =>
      cur
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  function removeItem(id) {
    setCartItems((cur) => cur.filter((it) => it.id !== id));
  }

  function toggleMembership() {
    setMembershipAdded((prev) => !prev);
  }

  const subtotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);

  function scrollToFooter() {
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
  }

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
            <span className="ec-address-text">{selectedAddress}</span>
            <span className="ec-caret">▾</span>
            {addressOpen && (
              <AddressDropdown
                isLoggedIn={isLoggedIn}
                addresses={savedAddresses}
                onSelect={handleAddressSelect}
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
            >
              Deals <span className="ec-caret">▾</span>
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
            >
              <span className="ec-cart-icon">🛒</span>
              <span className="ec-cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="ec-cart-badge" aria-label={`${cartCount} items`}>{cartCount}</span>
              )}
            </button>

            {cartOpen && (
              <div className="ec-cart-dropdown" role="dialog" aria-label="Cart">
                {membershipAdded && (
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
                    <a className="ec-change-plan" href="#" onClick={(e) => e.preventDefault()}>Change Plan</a>
                    <button className="ec-remove" onClick={toggleMembership}>REMOVE</button>
                  </div>
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
                          <div className="ec-item-brand">{it.brand}</div>
                          <div className="ec-item-name">{it.name}</div>
                        </div>
                        <div className="ec-item-right">
                          <div className="ec-item-price">
                            <span className="ec-old">₹{it.oldPrice}</span>
                            <span className="ec-new">₹{it.price}</span>
                          </div>
                          <div className="ec-qty">
                            <button onClick={() => changeQty(it.id, -1)} aria-label="decrease">-</button>
                            <span>{it.qty}</span>
                            <button onClick={() => changeQty(it.id, 1)} aria-label="increase">+</button>
                          </div>
                          <button 
                            className="ec-item-remove"
                            onClick={() => removeItem(it.id)}
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
                      <div className="ec-subtotal">Subtotal <span>₹{subtotal}</span></div>
                      <Link to="/cart" className="ec-cta">Proceed To Cart</Link>
                    </>
                  ) : (
                    <Link to="/menu" className="ec-cta ec-cta-empty">Start Shopping</Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="ec-get-app-button" onClick={scrollToFooter}>
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

      {/* Signup Modal */}
      {signupOpen && (
        <div className="ec-modal-overlay" onClick={closeSignup}>
          <div className="ec-signup-modal" ref={signupRef} onClick={(e) => e.stopPropagation()}>
            <button className="ec-modal-close" onClick={closeSignup}>
              ×
            </button>
            
            <div className="ec-modal-content">
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
              >
                CONTINUE
              </button>
              
              <div className="ec-divider">
                <span>or</span>
              </div>
              
              <button className="ec-google-btn" onClick={handleGoogleSignup}>
                <div className="ec-google-content">
                  <div className="ec-google-avatar">G</div>
                  <div className="ec-google-text">
                    <div className="ec-google-title">Sign up with Google Account</div>
                    <div className="ec-google-email">Create new account</div>
                  </div>
                </div>
              </button>
              
              <div className="ec-terms">
                By signing up, you agree to the <a href="#">Terms and Conditions</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

