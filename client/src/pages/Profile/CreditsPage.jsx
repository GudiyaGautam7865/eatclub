import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useUserContext } from "../../context/UserContext";
import ProfileHeader from '../../components/profile/ProfileHeader';

const CreditsPage = () => {
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
    } else if (section === 'messages') {
      navigate('/profile/messages');
    } else if (section === 'faqs') {
      navigate('/profile/faq');
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader />

      <div className="profile-content">
        <div className="profile-sidebar">
          <ul className="profile-menu">
            <li className="menu-item" onClick={() => handleNavigation('orders')}>Manage Orders</li>
            <li className="menu-item active">Credits</li>
            <li className="menu-item" onClick={() => handleNavigation('payment')}>Payment</li>
            <li className="menu-item" onClick={() => handleNavigation('address')}>Address</li>
            <li className="menu-item" onClick={() => handleNavigation('messages')}>Messages</li>
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
      

    </div>
  );
};

export default CreditsPage;