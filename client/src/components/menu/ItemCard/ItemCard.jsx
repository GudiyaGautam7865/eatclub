import React from 'react';
import './ItemCard.css';
import { Info } from 'lucide-react';

export const ProductCard = ({ item }) => {
  return (
    <div className="item-card">
      {/* Image Area */}
      <div className="item-image-container">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="item-image"
        />
        {item.isBestseller && (
          <div className="item-badge">
            Bestseller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="item-content">
        {/* Title Row with Veg/Non-Veg Icon */}
        <div className="item-header">
          <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
            <div className={`veg-indicator-dot ${item.isVeg ? 'veg' : 'non-veg'}`}></div>
          </div>
          <h3 className="item-name">{item.name}</h3>
        </div>

        <p className="item-description">
          {item.description}
        </p>

        <div className="item-action">
          {/* Price and Add Button Row */}
          <div className="item-footer">
            <div className="item-info">
              <span className="item-rating">
                <span className="rating-star">★</span>
                <span className="rating-value">{item.rating || 4.5}</span>
              </span>
            </div>
            
            <button className="add-btn">
              ADD
            </button>
          </div>

          {/* Membership Price Banner */}
          {item.membershipPrice && (
            <div className="price-tag">
              <span>₹ {item.membershipPrice}</span>
              <span>with</span>
              {/* EatClub Mini Logo Block */}
              <div className="price-badge">
                <span className="text-[7px] font-bold tracking-wider">EAT</span>
                <span className="text-[7px] font-bold tracking-wider">CLUB</span>
              </div>
              <span>membership</span>
              <Info size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};