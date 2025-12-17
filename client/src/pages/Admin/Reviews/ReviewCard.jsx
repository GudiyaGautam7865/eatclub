import React, { useState } from 'react';
import './ReviewCard.css';

export default function ReviewCard({ review, onViewDetails, onDelete }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleViewDetails = () => {
    setShowDropdown(false);
    onViewDetails(review);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    onDelete(review.id);
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="customer-info">
          <div className="customer-avatar">
            <img 
              src={review.customer.avatar} 
              alt={review.customer.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="avatar-fallback">
              {review.customer.name.charAt(0)}
            </div>
          </div>
          <div className="customer-details">
            <h4 className="customer-name">{review.customer.name}</h4>
            <div className="review-rating">
              {renderStars(review.rating)}
              <span className="rating-number">({review.rating})</span>
            </div>
          </div>
        </div>
        
        <div className="review-actions">
          <span className="review-date">{formatDate(review.date)}</span>
          <div className="dropdown-container">
            <button 
              className="dropdown-trigger"
              onClick={handleDropdownClick}
            >
              ⋯
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleViewDetails}>View Details</button>
                <button onClick={handleDelete} className="delete-btn">Delete Review</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="review-content">
        <p className="review-text">{review.reviewText}</p>
        
        <div className="menu-item-info">
          <div className="menu-item-image">
            <img 
              src={review.menuItem.image} 
              alt={review.menuItem.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60&h=60&fit=crop';
              }}
            />
          </div>
          <div className="menu-item-details">
            <span className="menu-item-name">{review.menuItem.name}</span>
            <span className="menu-item-price">₹{review.menuItem.price}</span>
          </div>
        </div>

        {review.images && review.images.length > 0 && (
          <div className="review-images">
            {review.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Review ${index + 1}`}
                className="review-image"
              />
            ))}
          </div>
        )}

        <div className="review-footer">
          <span className="helpful-count">👍 {review.helpful} found helpful</span>
        </div>
      </div>
    </div>
  );
}