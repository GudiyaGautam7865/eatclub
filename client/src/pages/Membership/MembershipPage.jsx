import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MembershipPage.css";

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const navigate = useNavigate();

  const brandMapping = {
    "Mojo Pizza": "mojo-pizza",
    "ZAZA Mughal Biryani": "zaza-biryani", 
    "BOX8": "box8",
    "globo ice creams": "globo-ice-creams",
    "LeanCrust Pizza": "leancrust-pizza",
    "NH1 Bowls": "nh1-bowls",
    "mealful rolls": "mealful-rolls",
    "Bhatti Chicken": "bhatti-chicken",
    "Boom Sandwich": "boom-sandwich",
    "hola pasta": "hola-pasta",
    "99 Meals": "99-meals",
    "Daily Kitchen": "daily-kitchen",
    "The Ghee Khichdi Project": "ghee-khichdi",
    "wefit": "wefit",
    "Burger House": "burger-house",
    "Noodle Bar": "noodle-bar"
  };

  const handleExploreClick = () => {
    navigate('/');
  };

  const handleBrandClick = (brandName) => {
    const productId = brandMapping[brandName];
    if (productId) {
      navigate(`/menu?product=${productId}`);
    }
  };

  return (
    <main className="membership-page">
      {/* Section 1: Why EatClub */}
      <section className="why-eatclub">
        <div className="why-container">
          <div className="why-header">
            <h1>Welcome to</h1>
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/membership_logo.png" alt="EatClub Logo" className="eatclub-logo" />
            <h2>Why EatClub?</h2>
          </div>
          <ul className="benefits-list">
            <li className="benefit-item">
              <div className="benefit-icon">%</div>
              <div className="benefit-content">
                <h3>Flat 30% OFF Everytime</h3>
                <p>Get consistent savings on every order</p>
              </div>
            </li>
            <li className="benefit-item">
              <div className="benefit-icon">₹</div>
              <div className="benefit-content">
                <h3>ZERO Delivery/Packaging Fees</h3>
                <p>No hidden charges, ever</p>
              </div>
            </li>
            <li className="benefit-item">
              <div className="benefit-icon">★</div>
              <div className="benefit-content">
                <h3>Handpicked Brands ONLY</h3>
                <p>Quality assured partner restaurants</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 2: Membership Selection */}
      <section className="membership-selection">
        <div className="selection-container">
          <div className="selection-header">
            <h2>Select Your<br />EatClub Membership</h2>
            <p className="location-notice">
              We are <span className="not-available">NOT AVAILABLE</span> at this location
            </p>
          </div>
          
          <div className="features-box">
            <ul>
              <li>No HIDDEN fees EVER</li>
              <li>Save 30% Everytime</li>
              <li>Handpicked brands ONLY</li>
            </ul>
          </div>

          <div className="membership-cards">
            <div className={`membership-card ${selectedPlan === 'free' ? 'selected' : ''}`} 
                 onClick={() => setSelectedPlan('free')}>
              <div className="card-badge">Best Value</div>
              <div className="card-price">FREE</div>
              <div className="card-duration">6 months</div>
              <div className="card-radio">
                <div className={`radio-circle ${selectedPlan === 'free' ? 'filled' : ''}`}></div>
              </div>
            </div>
            
            <div className={`membership-card ${selectedPlan === 'paid' ? 'selected' : ''}`}
                 onClick={() => setSelectedPlan('paid')}>
              <div className="card-price">₹30</div>
              <div className="card-old-price">₹199</div>
              <div className="card-duration">12 months</div>
              <div className="card-radio">
                <div className={`radio-circle ${selectedPlan === 'paid' ? 'filled' : ''}`}></div>
              </div>
            </div>
          </div>

          <p className="users-text">1M+ users are enjoying EatClub. It's your turn now!</p>
          <button className="explore-btn" onClick={handleExploreClick}>Explore Brands</button>
        </div>
      </section>

      {/* Section 3: Brands On Board */}
      <section className="brands-section">
        <div className="brands-container">
          <div className="brands-header">
            <h2>Brands On Board</h2>
            <p>Enjoy access to offers on these exclusive brands for the next month!</p>
          </div>
          <div className="brands-gallery">
            {[
              { name: "Mojo Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center" },
              { name: "ZAZA Mughal Biryani", img: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=200&h=200&fit=crop&crop=center" },
              { name: "BOX8", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop&crop=center" },
              { name: "globo ice creams", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&crop=center" },
              { name: "LeanCrust Pizza", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop&crop=center" },
              { name: "NH1 Bowls", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop&crop=center" },
              { name: "mealful rolls", img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop&crop=center" },
              { name: "Bhatti Chicken", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop&crop=center" },
              { name: "Boom Sandwich", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop&crop=center" },
              { name: "hola pasta", img: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=200&h=200&fit=crop&crop=center" },
              { name: "99 Meals", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&crop=center" },
              { name: "Daily Kitchen", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop&crop=center" },
              { name: "The Ghee Khichdi Project", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop&crop=center" },
              { name: "wefit", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop&crop=center" },
              { name: "Burger House", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop&crop=center" },
              { name: "Noodle Bar", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop&crop=center" }
            ].map((brand, index) => (
              <img 
                key={index}
                src={brand.img} 
                alt={brand.name}
                onClick={() => handleBrandClick(brand.name)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}