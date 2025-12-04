import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useCartContext } from "../../../../context/CartContext";
import { useCartContext } from "../../../context/CartContext";

function Header() {
  const navigate = useNavigate();
  const { items } = (() => {
    try {
      return useCartContext();
    } catch (e) {
      return { items: [] };
    }
  })();

  const cartCount = items?.length ?? 2; // fallback to 2 if context empty

  const [addressOpen, setAddressOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

  const addressRef = useRef(null);
  const dealsRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);

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

  function openOnly(setter) {
    setAddressOpen(false);
    setDealsOpen(false);
    setCartOpen(false);
    setProfileOpen(false);
    setter(true);
  }

  function toggleAddress(e) {
    e.stopPropagation();
    openOnly(setAddressOpen.bind(null, (v) => !addressOpen));
    setAddressOpen((s) => !s);
  }
  function toggleDeals(e) {
    e.stopPropagation();
    openOnly(setDealsOpen.bind(null, (v) => !dealsOpen));
    setDealsOpen((s) => !s);
  }
  function toggleCart(e) {
    e.stopPropagation();
    openOnly(setCartOpen.bind(null, (v) => !cartOpen));
    setCartOpen((s) => !s);
  }
  function toggleProfile(e) {
    e.stopPropagation();
    openOnly(setProfileOpen.bind(null, (v) => !profileOpen));
    setProfileOpen((s) => !s);
  }

  function changeQty(id, delta) {
    setCartItems((cur) =>
      cur.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    );
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
            <span className="ec-logo-mark">EAT</span>
            <span className="ec-logo-text">CLUB</span>
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
            <span className="ec-address-text">Ganesham Phase Building-G2, Sai Nagar</span>
            <span className="ec-caret">▾</span>
            {addressOpen && (
              <div className="ec-address-dropdown">Change location (placeholder)</div>
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
              <span className="ec-cart-badge" aria-label={`${cartCount} items`}>{cartCount}</span>
            </button>

            {cartOpen && (
              <div className="ec-cart-dropdown" role="dialog" aria-label="Cart">
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
                    <a className="ec-change-plan" href="#">Change Plan</a>
                    <button className="ec-remove">REMOVE</button>
                  </div>
                </div>

                <div className="ec-cart-items">
                  {cartItems.map((it) => (
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
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ec-cart-footer">
                  <div className="ec-subtotal">Subtotal <span>₹{subtotal}</span></div>
                  <Link to="/cart" className="ec-cta">Proceed To Cart</Link>
                </div>
              </div>
            )}
          </div>

          <button className="ec-get-app-button" onClick={scrollToFooter}>
            Get the app
          </button>

          <div className="ec-nav-item ec-profile" ref={profileRef}>
            <button
              className="ec-profile-button"
              onClick={toggleProfile}
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <span className="ec-profile-icon">👤</span>
              <span className="ec-profile-name">Vivek</span>
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
                  onClick={() => { console.log('Sign out clicked'); }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
