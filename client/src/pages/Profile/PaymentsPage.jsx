import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useUserContext } from "../../context/UserContext";
import ProfileHeader from '../../components/profile/ProfileHeader';

const PaymentsPage = () => {
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
            <li className="menu-item" onClick={() => handleNavigation('credits')}>Credits</li>
            <li className="menu-item active">Payment</li>
            <li className="menu-item" onClick={() => handleNavigation('address')}>Address</li>
            <li className="menu-item" onClick={() => handleNavigation('messages')}>Messages</li>
            <li className="menu-item" onClick={() => handleNavigation('faqs')}>FAQs</li>
          </ul>
        </div>

        <div className="profile-main">
          <h2>No Saved Payments</h2>
        </div>
      </div>
      

    </div>
  );
};

export default PaymentsPage;