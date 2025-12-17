import React from 'react';
import './ReviewDetailsModal.css';

export default function ReviewDetailsModal({ review, isOpen, onClose, onDelete }) {
  if (!isOpen || !review) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
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

  const handleDelete = () => {
    onDelete(review.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="review-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review Details</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Customer Section */}
          <div className="customer-section">
            <div className="customer-avatar-large">
              <img 
                src={review.customer.avatar} 
                alt={review.customer.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-fallback-large">
                {review.customer.name.charAt(0)}
              </div>
            </div>
            <div className="customer-info-detailed">
              <h3>{review.customer.name}</h3>
              <p>{review.customer.email}</p>
              <div className="review-meta">
                <div className="rating-detailed">
                  {renderStars(review.rating)}
                  <span className="rating-text">({review.rating}/5)</span>
                </div>
                <span className="review-date-detailed">{formatDate(review.date)}</span>
              </div>
            </div>
          </div>

          {/* Menu Item Section */}
          <div className="menu-item-section">
            <h4>Reviewed Item</h4>
            <div className="menu-item-detailed">
              <div className="menu-item-image-large">
                <img 
                  src={review.menuItem.image} 
                  alt={review.menuItem.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop';
                  }}
                />
              </div>
              <div className="menu-item-info-detailed">
                <h5>{review.menuItem.name}</h5>
                <p className="menu-item-price-large">₹{review.menuItem.price}</p>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="review-content-section">
            <h4>Review</h4>
            <p className="review-text-detailed">{review.reviewText}</p>
          </div>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="review-images-section">
              <h4>Photos</h4>
              <div className="review-images-grid">
                {review.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Review ${index + 1}`}
                    className="review-image-large"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="review-stats">
            <div className="stat-item">
              <span className="stat-label">Helpful votes:</span>
              <span className="stat-value">{review.helpful}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete Review
          </button>
        </div>
      </div>
    </div>
  );
}