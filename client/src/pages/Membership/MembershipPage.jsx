import React, { useState } from "react";
import "./MembershipPage.css";

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState('free');

  return (
    <main className="membership-page">
      {/* Section 1: Why EatClub */}
      <section className="why-eatclub">
        <div className="why-container">
          <div className="why-header">
            <h1>Welcome to</h1>
            <div className="logo-placeholder">EATCLUB LOGO</div>
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
          <button className="explore-btn">Explore Brands</button>
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
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center" alt="Mojo Pizza" />
            <img src="https://images.unsplash.com/photo-1563379091339-03246963d51a?w=200&h=200&fit=crop&crop=center" alt="ZAZA Mughal Biryani" />
            <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop&crop=center" alt="BOX8" />
            <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&crop=center" alt="globo ice creams" />
            <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop&crop=center" alt="LeanCrust Pizza" />
            <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop&crop=center" alt="NH1 Bowls" />
            <img src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop&crop=center" alt="mealful rolls" />
            <img src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop&crop=center" alt="Bhatti Chicken" />
            <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop&crop=center" alt="Boom Sandwich" />
            <img src="https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=200&h=200&fit=crop&crop=center" alt="hola pasta" />
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&crop=center" alt="99 Meals" />
            <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop&crop=center" alt="Daily Kitchen" />
            <img src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop&crop=center" alt="The Ghee Khichdi Project" />
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop&crop=center" alt="wefit" />
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop&crop=center" alt="Burger House" />
            <img src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop&crop=center" alt="Noodle Bar" />
          </div>
        </div>
      </section>
    </main>
  );
}