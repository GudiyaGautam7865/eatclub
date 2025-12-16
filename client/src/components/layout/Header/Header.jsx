import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useCartContext } from "../../../context/CartContext";
import { useUserContext } from "../../../context/UserContext";
import { useAddressContext } from "../../../context/AddressContext";
import { logout } from "../../../services/authService";
import MembershipModal from "../../cart/MembershipModal.jsx";
import LoginModal from "../../Auth/LoginModal";
import SignupModal from "../../Auth/SignupModal";
import AddressDropdown from "./AddressDropdown";
import SearchBar from "./SearchBar";

function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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

  const { user, isLoggedIn, setUser } = (() => {
    try {
      return useUserContext();
    } catch (e) {
      return { user: null, isLoggedIn: false, setUser: () => {} };
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
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const addressRef = useRef(null);
  const dealsRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);

  // Filter items with qty > 0
  const cartItems = items.filter((it) => it.qty > 0);
  const cartCount = itemsCount;
  const subtotal = itemsTotal;



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



  // Keyboard navigation
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        if (addressOpen) setAddressOpen(false);
        else if (dealsOpen) setDealsOpen(false);
        else if (cartOpen) setCartOpen(false);
        else if (profileOpen) setProfileOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [addressOpen, dealsOpen, cartOpen, profileOpen]);

  function openOnly(toggleFn) {
    setAddressOpen(false);
    setDealsOpen(false);
    setCartOpen(false);
    setProfileOpen(false);
    toggleFn();
  }

  function handleSignOut() {
    logout();
    setUser(null);
    setProfileOpen(false);
    navigate('/');
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
    <header className={`ec-header ${isScrolled ? 'scrolled' : ''}`}>
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

        <SearchBar />

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
            {!isLoggedIn ? (
              <button 
                className="ec-signup-button"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </button>
            ) : (
              <>
                <button
                  className="ec-profile-button"
                  onClick={toggleProfile}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  <div className="ec-profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  <span>{user?.name || 'User'}</span>
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
                      onClick={handleSignOut}
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

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />

      <SignupModal
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />


    </header>
  );
}

export default Header;