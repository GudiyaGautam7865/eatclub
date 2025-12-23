import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import './AdminTopbar.css';

export default function AdminTopbar({ sidebarCollapsed }) {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState({ name: 'Admin', role: 'Administrator', avatarUrl: '' });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem('ec_user');
      const stored = storedRaw ? JSON.parse(storedRaw) : null;
      const candidate = user?.role === 'ADMIN' ? user : stored?.role === 'ADMIN' ? stored : user || stored || {};
      setProfile({
        name: candidate.name || candidate.username || 'Admin',
        role: candidate.role === 'ADMIN' ? 'Administrator' : candidate.role || 'Admin',
        avatarUrl: candidate.avatar || candidate.avatarUrl || candidate.profileImage || candidate.image || candidate.photoUrl || '',
      });
    } catch {
      setProfile((prev) => ({ ...prev, name: user?.name || prev.name }));
    }
  }, [user]);

  const initials = (profile.name || 'A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || 'A';

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <div className={`admin-topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="admin-topbar-content">
        <div className="admin-topbar-search">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="10 10 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="      Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>
        
        <div className="admin-topbar-actions">
          <button className="notification-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="notification-badge">3</span>
          </button>
          
          <div className="admin-profile" onClick={handleProfileClick}>
            <div className="profile-avatar">
              {profile.avatarUrl && imageError ? (
                <img 
                  src={profile.avatarUrl}
                  alt={profile.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="profile-avatar-fallback">{initials}</div>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name">{profile.name}</div>
              <div className="profile-role">{profile.role || 'Admin'}</div>
            </div>
            <svg className="profile-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}