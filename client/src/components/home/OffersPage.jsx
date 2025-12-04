import React, { useRef, useState } from "react";
import "./OffersPage.css";

const offers = [
  { 
    id: 1,
    title: "HAPPY HOURS", 
    subtitle: "4-6 PM", 
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop", 
    type: "happy-hours",
    discount: "50% OFF"
  },
  { 
    id: 2,
    title: "BIRYANI", 
    price: "₹99", 
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=200&fit=crop", 
    type: "normal"
  },
  { 
    id: 3,
    title: "VALUE FUN PIZZAS", 
    price: "₹99", 
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop", 
    type: "normal"
  },
  { 
    id: 4,
    title: "PROTEIN MEALS", 
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop", 
    type: "protein"
  },
  { 
    id: 5,
    title: "₹99 MEALS", 
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop", 
    type: "special-99"
  },
  { 
    id: 6,
    title: "WHAT'S NEW", 
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop", 
    type: "whats-new"
  },
  { 
    id: 7,
    title: "BUY ONE GET ONE", 
    subtitle: "WEDNESDAY", 
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop", 
    type: "bogo"
  },
];

function OfferCard({ offer, onClick }) {
  const { title, price, image, type, discount, subtitle } = offer;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`offer-card ${type || "normal"}`}
      onClick={() => onClick && onClick(offer)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(offer)}
    >
      <div className="offer-content">
        <div className="offer-text-section">
          <h3 className="offer-title">{title}</h3>
          {subtitle && <p className="offer-subtitle">{subtitle}</p>}
          {price && <div className="offer-price">{price}</div>}
        </div>

        <div className="offer-image-section">
          {!imageError ? (
            <img 
              src={image} 
              alt={title} 
              className="offer-image"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="image-placeholder">
              <span>🍽️</span>
            </div>
          )}
        </div>
      </div>

      {type === "happy-hours" && (
        <div className="offer-footer">
          <span className="footer-text">50% OFF</span>
        </div>
      )}
    </div>
  );
}

export default function OffersPage() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    
    const scrollAmount = 200;
    el.scrollBy({ 
      left: scrollAmount * direction, 
      behavior: "smooth" 
    });
    
    setTimeout(checkScrollButtons, 300);
  };

  const handleOfferClick = (offer) => {
    console.log('Offer clicked:', offer);
  };

  React.useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => el.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <section className="offers-section">
      <h2 className="offers-title">Top offers today</h2>

      <div className="offers-container">
        {canScrollLeft && (
          <button 
            className="scroll-btn scroll-left" 
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        <div 
          className="offers-scroll" 
          ref={trackRef}
          onScroll={checkScrollButtons}
        >
          {offers.map((offer) => (
            <OfferCard 
              key={offer.id} 
              offer={offer} 
              onClick={handleOfferClick}
            />
          ))}
        </div>

        {canScrollRight && (
          <button 
            className="scroll-btn scroll-right" 
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}
