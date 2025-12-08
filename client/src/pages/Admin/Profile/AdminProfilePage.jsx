import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../../services/adminAuthService';
import './AdminProfilePage.css';

export default function AdminProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  // Get login time from localStorage
  const loginTime = adminAuthService.getAdminLoginTime();

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-header">
        <h1 className="admin-profile-title">Admin Profile</h1>
        <p className="admin-profile-subtitle">Manage your admin account and view statistics</p>
      </div>

      <div className="admin-profile-card">
        <div className="admin-profile-top">
          <div className="admin-profile-avatar-large">
            A
          </div>
          <div className="admin-profile-info">
            <h2 className="admin-profile-name">Admin User</h2>
            <p className="admin-profile-email">admin@eatclub.com</p>
            <div className="admin-profile-role-badge">
              <span>🔐</span>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <div className="admin-profile-stats">
          <div className="admin-profile-stat">
            <div className="admin-profile-stat-label">Total Menu Items</div>
            <div className="admin-profile-stat-value">247</div>
          </div>
          <div className="admin-profile-stat">
            <div className="admin-profile-stat-label">Total Orders</div>
            <div className="admin-profile-stat-value">1,543</div>
          </div>
          <div className="admin-profile-stat">
            <div className="admin-profile-stat-label">Active Users</div>
            <div className="admin-profile-stat-value">892</div>
          </div>
          <div className="admin-profile-stat">
            <div className="admin-profile-stat-label">Total Revenue</div>
            <div className="admin-profile-stat-value">₹8.2L</div>
          </div>
        </div>

        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">Account Details</h3>
          <div className="admin-profile-field">
            <span className="admin-profile-field-label">Username</span>
            <span className="admin-profile-field-value">admin</span>
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-field-label">Email</span>
            <span className="admin-profile-field-value">admin@eatclub.com</span>
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-field-label">Role</span>
            <span className="admin-profile-field-value">Super Administrator</span>
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-field-label">Account Status</span>
            <span className="admin-profile-field-value" style={{ color: '#2e7d32' }}>Active</span>
          </div>
        </div>

        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">Session Information</h3>
          <div className="admin-profile-field">
            <span className="admin-profile-field-label">Login Time</span>
            <span className="admin-profile-field-value">
              {loginTime ? new Date(parseInt(loginTime)).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-field-label">Last Activity</span>
            <span className="admin-profile-field-value">Just now</span>
          </div>
        </div>

        <div className="admin-profile-actions">
          <button className="admin-profile-btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
