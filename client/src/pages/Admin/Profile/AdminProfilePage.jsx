import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../../services/adminAuthService';
import { 
  User, Mail, Shield, Calendar, Clock, Globe, Monitor,
  Package, DollarSign, Users, Utensils, TrendingUp,
  CheckCircle, Edit, Trash2, UserPlus, Lock, Settings,
  Activity, LogOut, Key, Zap
} from 'lucide-react';
import './AdminProfilePage.css';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const loginTime = adminAuthService.getAdminLoginTime();

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/');
  };

  const stats = [
    { Icon: Package, label: 'Total Orders', value: '1,543', change: '+12%', color: '#4ECDC4' },
    { Icon: DollarSign, label: 'Revenue', value: '₹8.2L', change: '+18%', color: '#FF6B35' },
    { Icon: Users, label: 'Active Users', value: '892', change: '+5%', color: '#6BCB77' },
    { Icon: Utensils, label: 'Menu Items', value: '247', change: '+8', color: '#FFD93D' },
  ];

  const activities = [
    { Icon: CheckCircle, action: 'Approved new menu item', item: 'Paneer Tikka Masala', time: '2 hours ago', color: '#4CAF50' },
    { Icon: Edit, action: 'Updated order status', item: 'Order #1234', time: '4 hours ago', color: '#2196F3' },
    { Icon: Trash2, action: 'Deleted menu item', item: 'Old Special Thali', time: '1 day ago', color: '#F44336' },
    { Icon: UserPlus, action: 'New user registered', item: 'john@example.com', time: '2 days ago', color: '#9C27B0' },
  ];

  const permissions = [
    { name: 'Manage Menu', granted: true },
    { name: 'View Orders', granted: true },
    { name: 'Manage Users', granted: true },
    { name: 'View Analytics', granted: true },
    { name: 'System Settings', granted: true },
    { name: 'Financial Reports', granted: true },
  ];

  return (
    <div className="admin-profile-page">
      <div className="profile-hero">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              <User size={56} />
            </div>
            <div className="profile-status-badge"></div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">Admin User</h1>
            <p className="profile-hero-email">
              <Mail size={16} />
              admin@eatclub.com
            </p>
            <div className="profile-badges">
              <span className="profile-badge primary">
                <Shield size={14} />
                Super Admin
              </span>
              <span className="profile-badge success">
                <CheckCircle size={14} />
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={18} />
          Overview
        </button>
        <button 
          className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Clock size={18} />
          Activity
        </button>
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="profile-stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.Icon;
              return (
                <div key={index} className="profile-stat-card" style={{ borderLeftColor: stat.color }}>
                  <div className="profile-stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                    <Icon size={28} />
                  </div>
                  <div className="profile-stat-content">
                    <div className="profile-stat-label">{stat.label}</div>
                    <div className="profile-stat-value">{stat.value}</div>
                    <div className="profile-stat-change positive">
                      <TrendingUp size={14} />
                      {stat.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="profile-grid">
            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">
                  <User size={20} />
                  Account Information
                </h3>
              </div>
              <div className="profile-card-body">
                <div className="profile-info-item">
                  <span className="profile-info-label">Username</span>
                  <span className="profile-info-value">admin</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">admin@eatclub.com</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Role</span>
                  <span className="profile-info-value">Super Administrator</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Status</span>
                  <span className="profile-info-badge active">Active</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Member Since</span>
                  <span className="profile-info-value">January 2024</span>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">
                  <Lock size={20} />
                  Permissions
                </h3>
              </div>
              <div className="profile-card-body">
                <div className="permissions-grid">
                  {permissions.map((perm, index) => (
                    <div key={index} className="permission-item">
                      <CheckCircle size={16} className="permission-icon" />
                      <span className="permission-name">{perm.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-card-header">
              <h3 className="profile-card-title">
                <Clock size={20} />
                Session Details
              </h3>
            </div>
            <div className="profile-card-body">
              <div className="session-grid">
                <div className="session-item">
                  <div className="session-icon">
                    <Key size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">Login Time</div>
                    <div className="session-value">
                      {loginTime ? new Date(parseInt(loginTime)).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="session-item">
                  <div className="session-icon">
                    <Zap size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">Last Activity</div>
                    <div className="session-value">Just now</div>
                  </div>
                </div>
                <div className="session-item">
                  <div className="session-icon">
                    <Globe size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">IP Address</div>
                    <div className="session-value">192.168.1.1</div>
                  </div>
                </div>
                <div className="session-item">
                  <div className="session-icon">
                    <Monitor size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">Device</div>
                    <div className="session-value">Chrome on Windows</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'activity' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">
              <Activity size={20} />
              Recent Activity
            </h3>
          </div>
          <div className="profile-card-body">
            <div className="activity-timeline">
              {activities.map((activity, index) => {
                const Icon = activity.Icon;
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon" style={{ background: `${activity.color}20`, color: activity.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-item-name">{activity.item}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">
              <Settings size={20} />
              Account Settings
            </h3>
          </div>
          <div className="profile-card-body">
            <div className="settings-section">
              <h4 className="settings-section-title">Security</h4>
              <button className="settings-btn">
                <Key size={18} />
                Change Password
              </button>
              <button className="settings-btn">
                <Shield size={18} />
                Enable Two-Factor Auth
              </button>
            </div>
            <div className="settings-section">
              <h4 className="settings-section-title">Notifications</h4>
              <button className="settings-btn">
                <Activity size={18} />
                Notification Preferences
              </button>
              <button className="settings-btn">
                <Mail size={18} />
                Email Settings
              </button>
            </div>
            <div className="settings-section danger-zone">
              <h4 className="settings-section-title">Danger Zone</h4>
              <button className="settings-btn danger" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
