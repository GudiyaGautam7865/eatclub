import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewDetailsModal from './ReviewDetailsModal';
import { mockReviews, getReviewsByRating, searchReviews } from './reviewsMockData';
import './ReviewsPage.css';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedRating, setSelectedRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const ratingTabs = [
    { key: 'all', label: 'All', count: mockReviews.length },
    { key: 5, label: '5 ⭐', count: mockReviews.filter(r => r.rating === 5).length },
    { key: 4, label: '4 ⭐', count: mockReviews.filter(r => r.rating === 4).length },
    { key: 3, label: '3 ⭐', count: mockReviews.filter(r => r.rating === 3).length },
    { key: 2, label: '2 ⭐', count: mockReviews.filter(r => r.rating === 2).length },
    { key: 1, label: '1 ⭐', count: mockReviews.filter(r => r.rating === 1).length }
  ];

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, selectedRating, searchTerm]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReviews(mockReviews);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = getReviewsByRating(selectedRating);
    filtered = searchReviews(filtered, searchTerm);
    setFilteredReviews(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    // TODO: Add API call to delete review
    console.log('Delete review:', reviewId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="reviews-page-loading">
        <div className="loading-spinner">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Customer Reviews</span>
          </div>
          <h1 className="page-title">Customer Reviews</h1>
          <p className="page-subtitle">
            Manage and monitor customer feedback ({reviews.length} total reviews)
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{getAverageRating()}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{reviews.length}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search by customer name, menu item, or review content..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="rating-tabs">
          {ratingTabs.map((tab) => (
            <button
              key={tab.key}
              className={`rating-tab ${selectedRating === tab.key ? 'active' : ''}`}
              onClick={() => handleRatingFilter(tab.key)}
            >
              {tab.label}
              <span className="tab-count">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-content">
        {filteredReviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No reviews found</h3>
            <p>
              {searchTerm || selectedRating !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No customer reviews available yet'
              }
            </p>
          </div>
        ) : (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}