import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useUserContext } from "../../context/UserContext";

const CreditsPage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
   const { user } = useUserContext();
  if (!user) {
  return <div style={{ padding: "20px" }}>Please login to view your profile</div>;
}

  const handleNavigation = (section) => {
    if (section === 'orders') {
      navigate('/profile');
    } else if (section === 'payment') {
      navigate('/profile/payments');
    } else if (section === 'address') {
      navigate('/profile/addresses');
    } else if (section === 'notification') {
      navigate('/profile/notification');
    } else if (section === 'faqs') {
      navigate('/profile/faq');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-details">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phoneNumber || "Not Added"}</p>
          </div>
        </div>
        <button className="edit-btn" onClick={() => setShowEditModal(true)}>EDIT</button>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <ul className="profile-menu">
            <li className="menu-item" onClick={() => handleNavigation('orders')}>Manage Orders</li>
            <li className="menu-item active">Credits</li>
            <li className="menu-item" onClick={() => handleNavigation('payment')}>Payment</li>
            <li className="menu-item" onClick={() => handleNavigation('address')}>Address</li>
            <li className="menu-item" onClick={() => handleNavigation('notification')}>Manage Notification</li>
            <li className="menu-item" onClick={() => handleNavigation('faqs')}>FAQs</li>
          </ul>
        </div>

        <div className="profile-main">
          <div className="credits-content">
            <div className="credits-header">
              <h2>Hello {user?.name},</h2>
              <p>Your Credit Balance is</p>
              <div className="credit-amount">₹ 0</div>
            </div>
            <div className="no-transactions">
              <div className="transaction-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>No transactions found</h3>
              <p>You don't have any credits yet.</p>
            </div>
          </div>
        </div>
      </div>
      
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            
            <div className="form-field">
              <label>Name*</label>
              <div className="input-container">
                <input type="text" defaultValue= {user?.name} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            
            <div className="form-field">
              <label>Phone No.</label>
              <input type="text" defaultValue={user?.phoneNumber || "Not Added"} />
            </div>
            
            <div className="form-field">
              <label>Email*</label>
              <div className="input-container">
                <input type="email" defaultValue={user?.email} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            
            <div className="form-field">
              <label>Password*</label>
              <div className="password-container">
                <input type="password" defaultValue="••••••••••" />
                <span className="change-link">Change</span>
              </div>
            </div>
            
            <div className="form-field">
              <label>DOB*</label>
              <div className="dob-container">
                <input type="date" placeholder="Select Date" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsPage;