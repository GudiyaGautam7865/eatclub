import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import OffersPage from "../../components/home/OffersPage";
import CategorySlider from "../../components/home/CategorySlider";
import Restaurant from "../../components/home/Restaurant";
import Footer from "../../components/layout/Footer/Footer";
// Product IDs now come directly from API-loaded cards

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
  const navigate = useNavigate();
  const [headerVisible, setHeaderVisible] = useState(false);

  const handleRestaurantClick = (restaurant) => {
    const productId = restaurant.id; // already normalized from API
    if (productId) {
      navigate(`/menu?restaurant=${productId}`);
      setTimeout(() => window.scrollTo(0, 0), 100);
    }
  };

  const handleOrderNow = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Video Banner Section with Header */}
      <div 
        className="video-banner"
        onMouseEnter={() => setHeaderVisible(true)}
        onMouseLeave={() => setHeaderVisible(false)}
      >
        <video className="banner-video" autoPlay muted loop playsInline>
          <source src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095810.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay">
          <div className="banner-content ">
          
            <h1>Delicious Food Delivered</h1>
            <p>Order your favorite meals from top restaurants</p>
            <button className="cta-button" onClick={handleOrderNow}>Order Now</button>
            <div className="offers-section">
            <OffersPage />
            </div>
          </div>
        </div>
      </div>

      {/* Top offers section (OffersPage) */}
      

      {/* Category slider (What's on your mind) */}
      <CategorySlider />

      {/* Restaurants section */}
      <div id="menu-section">
        <Restaurant onRestaurantClick={handleRestaurantClick} />
      </div>
      
      {/* Footer */}
    
    
      </div>
  );
}

export default HomePage;