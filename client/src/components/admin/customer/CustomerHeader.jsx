import React from 'react';
import './CustomerHeader.css';

export default function CustomerHeader() {
  return (
    <div className="customer-header">
      <div className="search-section">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search here"
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-content">
        <h1 className="page-title">Customer Detail</h1>
        <p className="page-subtitle">Here your Customer Detail Profile</p>
      </div>
    </div>
  );
}