import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminTopbar.css';

export default function AdminTopbar() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-left">
        <h1 className="admin-topbar-title">Admin Panel</h1>
      </div>
      <div className="admin-topbar-right">
        <div className="admin-profile-chip" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <div className="admin-profile-avatar">A</div>
          <div className="admin-profile-name">Admin</div>
        </div>
      </div>
    </div>
  );
}
