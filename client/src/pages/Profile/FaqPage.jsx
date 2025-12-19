import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useUserContext } from "../../context/UserContext";
import ProfileHeader from '../../components/profile/ProfileHeader';

const FaqPage = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  
  if (!user) {
    return <div style={{ padding: "20px" }}>Please login to view your profile</div>;
  }

  const handleNavigation = (section) => {
    if (section === 'orders') {
      navigate('/profile');
    } else if (section === 'credits') {
      navigate('/profile/credits');
    } else if (section === 'payment') {
      navigate('/profile/payments');
    } else if (section === 'address') {
      navigate('/profile/addresses');
    } else if (section === 'messages') {
      navigate('/profile/messages');
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader />

      <div className="profile-content">
        <div className="profile-sidebar">
          <ul className="profile-menu">
            <li className="menu-item" onClick={() => handleNavigation('orders')}>Manage Orders</li>
            <li className="menu-item" onClick={() => handleNavigation('credits')}>Credits</li>
            <li className="menu-item" onClick={() => handleNavigation('payment')}>Payment</li>
            <li className="menu-item" onClick={() => handleNavigation('address')}>Address</li>
            <li className="menu-item" onClick={() => handleNavigation('messages')}>Messages</li>
            <li className="menu-item active">FAQs</li>
          </ul>
        </div>

        <div className="profile-main">
          <div className="faq-content">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <span>FAQs</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
              <div className="faq-item">
                <span>Referral & Coupons</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
              <div className="faq-item">
                <span>Payment</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
              <div className="faq-item">
                <span>EatClub Membership</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
              <div className="faq-item">
                <span>Terms & Conditions</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default FaqPage;