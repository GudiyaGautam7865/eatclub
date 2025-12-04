import React from "react";
import "./HomePage.css";
import OffersPage from "../../components/home/OffersPage";
import CategorySlider from "../../components/home/CategorySlider";
import Restaurant from "../../components/home/Restaurant";
import Footer from "../../components/layout/Footer/Footer";

// This is a placeholder component for a single offer card
const OfferCard = ({ title, price, imageUrl, className = "", label = null }) => (
  <div className={`offer-card ${className}`}>
    <div className="offer-card-image">
      <img src={imageUrl} alt={title} />
      {label && <span className="offer-label">{label}</span>}
      {className === "special-99" && (
        <div className="rupee">₹99</div>
      )}
    </div>
    <div className="offer-card-text">{title}</div>
    {price && <div className="offer-card-price">{price}</div>}
  </div>
);

function HomePage() {
  return (
    <div className="home-page">
      {/* Promotional Banner Section */}
      <div className="promo-banner">
        {/* Left Content */}
        <div className="promo-left">
          <div className="promo-text">
            <p className="promo-intro">Get <span className="cyan-text">50% OFF</span> on</p>
            <h1>FIRST 3 APP ORDERS</h1>
            <p className="no-fees">+ No extra fees</p>
            <div className="promo-code">
              <p>Use Code: <strong>FIRST3</strong></p>
            </div>

            </div>
        </div>

        {/* Vertical Divider */}
        <div className="vertical-divider"></div>

        {/* Right QR Code */}
        <div className="promo-right">
          <div className="qr-container">
            <div className="qr-code-box">
              <img src="/src/assets/images/scan.png" alt="Scan to download app QR Code" />
            </div>
            <p className="scan-text">Scan to download the app</p>
          </div>
        </div>
      </div>

      {/* Top offers section (OffersPage) */}
      <OffersPage />

      {/* Category slider (What's on your mind) */}
      <CategorySlider />

      {/* Restaurants section */}
      <Restaurant />
      
      {/* Footer */}
    
    
      </div>
  );
}

export default HomePage;