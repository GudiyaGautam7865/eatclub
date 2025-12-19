import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useUserContext } from "../../context/UserContext";
import ProfileHeader from '../../components/profile/ProfileHeader';


const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const navigate = useNavigate();
  const { user } = useUserContext();
  
  if (!user) {
    return <div style={{ padding: "20px" }}>Please login to view your profile</div>;
  }

  const handleNavigation = (section) => {
    if (section === 'credits') {
      navigate('/profile/credits');
    } else if (section === 'payment') {
      navigate('/profile/payments');
    } else if (section === 'address') {
      navigate('/profile/addresses');
    } else if (section === 'messages') {
      navigate('/profile/messages');
    } else if (section === 'faqs') {
      navigate('/profile/faq');
    } else {
      setActiveSection(section);  
    }
  };

  const renderContent = () => {
    return (
      <div className="no-orders">
        <div className="no-orders-icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6"/>
            <circle cx="9" cy="20" r="1"/>
            <circle cx="20" cy="20" r="1"/>
          </svg>
        </div>
        <h3>No Orders Yet</h3>
        <p>Awaiting your orders!</p>
        <p>Avail 50% OFF on 1st order.</p>
        <p>Code: APP50</p>
        <button className="order-now-btn">Order Now</button>
      </div>
    );
  };

  return (
    <>
      <div className="profile-page">
        <ProfileHeader />

        <div className="profile-content">
          {/* Sidebar Menu */}
          <div className="profile-sidebar">
            <ul className="profile-menu">
              <li className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => handleNavigation('orders')}>Manage Orders</li>
              <li className="menu-item" onClick={() => handleNavigation('credits')}>Credits</li>
              <li className="menu-item" onClick={() => handleNavigation('payment')}>Payment</li>
              <li className="menu-item" onClick={() => handleNavigation('address')}>Address</li>
              <li className="menu-item" onClick={() => handleNavigation('messages')}>Messages</li>
              <li className="menu-item" onClick={() => handleNavigation('faqs')}>FAQs</li>
            </ul>
          </div>

          {/* Main Content Area */}
          <div className="profile-main">
            {renderContent()}
          </div>
        </div>
      </div>
      

     
    </>
  );
};

export default ProfilePage;