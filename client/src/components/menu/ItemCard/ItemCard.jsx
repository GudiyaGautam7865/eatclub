import React from 'react';
import './ItemCard.css';
import { Info } from 'lucide-react';
import useCart from '../../../hooks/useCart';

export const ProductCard = ({ item }) => {
  const { getItemQuantity, addToCart, updateItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      title: item.name,
      section: item.categoryName || 'Menu Item',
      price: item.price || 0,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg
    });
  };

  const handleIncrement = () => {
    updateItemQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateItemQuantity(item.id, quantity - 1);
  };

  // Truncate description to 2-3 lines
  const truncateDescription = (text, lines = 2) => {
    if (!text) return '';
    const lineArray = text.split('\n');
    const truncated = lineArray.slice(0, lines).join(' ');
    return truncated.length > 80 ? truncated.substring(0, 80) + '...' : truncated;
  };

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
          <div className="item-badge bestseller-badge">
            Bestseller
          </div>
        )}
        {/* Category Badge */}
        {item.categoryName && (
          <div className="item-badge category-badge">
            {item.categoryName}
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

        {/* Description */}
        <p className="item-description" title={item.description}>
          {truncateDescription(item.description)}
        </p>

        {/* Price Section */}
        <div className="item-price-section">
          <span className="item-price">₹{item.price}</span>
          <span className="item-rating">
            <span className="rating-star">★</span>
            <span className="rating-value">{item.rating || 4.5}</span>
          </span>
        </div>

        {/* Action Section */}
        <div className="item-action">
          {quantity === 0 ? (
            <button className="add-btn" onClick={handleAddToCart}>
              ADD +
            </button>
          ) : (
            <div className="qty-control">
              <button 
                className="qty-btn qty-btn-minus" 
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn qty-btn-plus" 
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};