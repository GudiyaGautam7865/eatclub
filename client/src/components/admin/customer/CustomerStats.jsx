import React from 'react';
import './CustomerStats.css';

export default function CustomerStats({ customer }) {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  };

  if (!customer) return null;

  return (
    <div className="customer-stats">
      <div className="customer-profile-card">
        <div className="profile-section">
          <div className="profile-image">
            <div className="avatar-circle">
              {getInitials(customer.name)}
            </div>
          </div>
          
          <div className="profile-info">
            <h2 className="customer-name">{customer.name}</h2>
            <p className="customer-role">{customer.role}</p>
            <p className="customer-address">{customer.address}</p>
            
            <div className="contact-info">
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{customer.email}</span>
              </div>
              
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.56 4.04 6.32 5.84C6.48 6.24 6.36 6.68 6.04 6.96L4.2 8.8C6.04 12.6 9.4 15.96 13.2 17.8L15.04 15.96C15.32 15.64 15.76 15.52 16.16 15.68C17.96 16.44 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{customer.phone}</span>
              </div>
            </div>
            
            <div className="company-info">
              <span className="company-label">Company:</span>
              <span className="company-name">{customer.company}</span>
            </div>
          </div>
          
          <button className="edit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="balance-card">
        <div className="balance-header">
          <h3>Balance</h3>
        </div>
        <div className="balance-amount">${customer.balance.toLocaleString()}</div>
        <div className="card-info">
          <div className="card-number">{customer.cardNumber}</div>
          <div className="card-holder">{customer.name}</div>
        </div>
      </div>
    </div>
  );
}