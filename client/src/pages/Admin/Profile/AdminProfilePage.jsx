import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../../services/adminAuthService';
import { getAdminDashboardStats } from '../../../services/adminStatsService';
import adminProfileService from '../../../services/adminProfileService';
import { useUserContext } from '../../../context/UserContext';
import { 
  User, Mail, Shield, Calendar, Clock, Globe, Monitor,
  Package, DollarSign, Users, Utensils, TrendingUp,
  CheckCircle, Edit, Trash2, UserPlus, Lock, Settings,
  Activity, LogOut, Key, Zap, Save, X
} from 'lucide-react';
import AvatarEditor from '../../../components/admin/profile/AvatarEditor';
import Toast from '../../../components/common/Toast';
import './AdminProfilePage.css';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const [activeTab, setActiveTab] = useState('overview');
  const loginTime = adminAuthService.getAdminLoginTime();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({
    timezone: '',
    ipAddress: '',
    device: '',
    loginTime: null,
    lastActivity: null,
    serverTime: null,
  });

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phoneNumber: '', avatar: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email change modal
  const [showEmailModal, setShowEmailModal] = useState(false);
    // Avatar editor modal
    const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailStep, setEmailStep] = useState(1); // 1 = enter email, 2 = enter code
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, profileData] = await Promise.all([
          getAdminDashboardStats().catch(() => null),
          adminProfileService.getAdminProfile().catch(() => null),
        ]);
        
        setDashboard(statsData);
        if (profileData) {
          setAdminProfile(profileData);
          setUser(profileData);
          localStorage.setItem('ec_user', JSON.stringify(profileData));
        }
      } catch (err) {
        console.error('Failed to load admin data', err);
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setUser]);

  useEffect(() => {
    const timezone = typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC';
    const device = typeof window !== 'undefined'
      ? `${navigator.platform || 'Unknown'} • ${navigator.userAgent || 'Unknown'}`
      : 'Unknown';
    const recentActivity = dashboard?.recentOrders?.[0]?.createdAt;

    setSessionInfo({
      timezone,
      device,
      ipAddress: dashboard?.requestMeta?.clientIp || 'Not captured',
      loginTime: loginTime ? new Date(loginTime) : null,
      lastActivity: recentActivity ? new Date(recentActivity) : null,
      serverTime: dashboard?.requestMeta?.serverTime ? new Date(dashboard.requestMeta.serverTime) : null,
    });
  }, [dashboard, loginTime]);

  const handleLogout = () => {
    adminAuthService.logout();
    setUser(null);
    navigate('/');
  };

  const resolvedProfile = (() => {
    const candidate = adminProfile || user || {};
    return {
      name: candidate.name || 'Admin',
      email: candidate.email || '',
      phoneNumber: candidate.phoneNumber || '',
      role: candidate.role || 'ADMIN',
      isActive: candidate.isActive !== false,
      createdAt: candidate.createdAt || null,
      avatar: candidate.avatar || '',
    };
  })();

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
    return initials || 'A';
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleString();
    } catch (err) {
      console.error('Failed to format date', err);
      return '—';
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditForm({
        name: resolvedProfile.name,
        phoneNumber: resolvedProfile.phoneNumber,
        avatar: resolvedProfile.avatar,
      });
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name?.trim()) {
      setToast({ message: 'Name is required', type: 'error' });
      return;
    }
    try {
      setSaving(true);
      const updated = await adminProfileService.updateAdminProfile({
        name: editForm.name,
        phoneNumber: editForm.phoneNumber,
        avatar: editForm.avatar,
      });
      setAdminProfile(updated);
      setUser(updated);
      localStorage.setItem('ec_user', JSON.stringify(updated));
      setToast({ message: 'Profile updated successfully', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      setToast({ message: err?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEmailChange = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setToast({ message: 'Please enter a valid email', type: 'error' });
      return;
    }

    try {
      setEmailLoading(true);
      const response = await adminProfileService.requestEmailChange(newEmail);
      setToast({ message: response.message || 'Verification code sent!', type: 'success' });
      setEmailStep(2);
    } catch (err) {
      setToast({ message: err.message || 'Failed to request email change', type: 'error' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setToast({ message: 'Please enter the 6-digit code', type: 'error' });
      return;
    }
    try {
      setEmailLoading(true);
      const updated = await adminProfileService.confirmEmailChange(verificationCode);
      setAdminProfile(updated);
      setUser(updated);
      localStorage.setItem('ec_user', JSON.stringify(updated));
      setToast({ message: 'Email updated successfully!', type: 'success' });
      setShowEmailModal(false);
      setNewEmail('');
      setVerificationCode('');
      setEmailStep(1);
    } catch (err) {
      setToast({ message: err.message || 'Invalid verification code', type: 'error' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setToast({ message: 'Please fill all password fields', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters', type: 'error' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    try {
      setPasswordLoading(true);
      await adminProfileService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setToast({ message: 'Password changed successfully', type: 'success' });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setToast({ message: err?.message || 'Failed to change password', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const stats = dashboard ? [
    { 
      Icon: Package, 
      label: 'Total Orders', 
      value: (dashboard.stats?.totalOrders ?? 0).toLocaleString(), 
      change: `+${(dashboard.stats?.monthlyOrders ?? 0).toLocaleString()} this month`, 
      color: '#4ECDC4' 
    },
    { 
      Icon: DollarSign, 
      label: 'Revenue', 
      value: `₹${(dashboard.stats?.totalRevenue ?? 0).toLocaleString()}`, 
      change: `+₹${(dashboard.stats?.monthlyRevenue ?? 0).toLocaleString()} this month`, 
      color: '#FF6B35' 
    },
    { 
      Icon: Users, 
      label: 'Active Users', 
      value: (dashboard.stats?.totalCustomers ?? 0).toLocaleString(), 
      change: `${(dashboard.stats?.todayOrders ?? 0).toLocaleString()} orders today`, 
      color: '#6BCB77' 
    },
    { 
      Icon: Utensils, 
      label: 'Menu Items', 
      value: (dashboard.stats?.activeMenuItems ?? 0).toLocaleString(), 
      change: `${(dashboard.stats?.pendingOrders ?? 0).toLocaleString()} pending`, 
      color: '#FFD93D' 
    },
  ] : [];

  const activities = (dashboard?.recentOrders ?? []).map((o) => ({
    Icon: CheckCircle,
    action: `Order ${o.orderId}`,
    item: `${o.customer} • ₹${(o.amount ?? 0).toLocaleString()}`,
    time: formatDateTime(o.createdAt),
    color: '#4CAF50'
  }));

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
      {toast && (
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 9999 }}>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={4000}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {loading && (
        <div className="profile-card" style={{ marginBottom: 16 }}>
          <div className="profile-card-body">Loading profile data…</div>
        </div>
      )}
      {error && (
        <div className="profile-card" style={{ marginBottom: 16 }}>
          <div className="profile-card-body">Error: {error}</div>
        </div>
      )}
      <div className="profile-hero">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {resolvedProfile.avatar ? (
                <img
                  src={resolvedProfile.avatar}
                  alt={resolvedProfile.name}
                  className="profile-avatar-image"
                />
              ) : (
                <span className="profile-avatar-initials">{getInitials(resolvedProfile.name)}</span>
              )}
            </div>
            <div className="profile-status-badge"></div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">{resolvedProfile.name}</h1>
            <p className="profile-hero-email">
              <Mail size={16} />
              {resolvedProfile.email || 'No email on file'}
            </p>
            <div className="profile-badges">
              <span className="profile-badge primary">
                <Shield size={14} />
                {resolvedProfile.role === 'ADMIN' ? 'Super Admin' : resolvedProfile.role || 'Admin'}
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
                <button className="edit-profile-btn" onClick={handleEditToggle}>
                  {isEditing ? <X size={18} /> : <Edit size={18} />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="profile-card-body">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Avatar URL</label>
                      <input
                        type="text"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        placeholder="Enter avatar URL"
                      />
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button className="settings-btn" onClick={() => setShowAvatarModal(true)}>
                          <Edit size={18} />
                          Edit Photo (Crop & Preview)
                        </button>
                        {editForm.avatar && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, color: '#666' }}>Topbar preview:</span>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                              <img src={editForm.avatar} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 65%' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      className="save-btn" 
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Username</span>
                      <span className="profile-info-value">{resolvedProfile.name || '—'}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Email</span>
                      <span className="profile-info-value">{resolvedProfile.email || '—'}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Phone</span>
                      <span className="profile-info-value">{resolvedProfile.phoneNumber || '—'}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Role</span>
                      <span className="profile-info-value">{resolvedProfile.role === 'ADMIN' ? 'Administrator' : resolvedProfile.role || '—'}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Status</span>
                      <span className={`profile-info-badge ${resolvedProfile.isActive === false ? 'inactive' : 'active'}`}>
                        {resolvedProfile.isActive === false ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Member Since</span>
                      <span className="profile-info-value">{formatDateTime(resolvedProfile.createdAt || sessionInfo.loginTime)}</span>
                    </div>
                  </>
                )}
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
                    <div className="session-value">{formatDateTime(sessionInfo.loginTime)}</div>
                  </div>
                </div>
                <div className="session-item">
                  <div className="session-icon">
                    <Zap size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">Last Activity</div>
                    <div className="session-value">{formatDateTime(sessionInfo.lastActivity || sessionInfo.serverTime)}</div>
                  </div>
                </div>
                <div className="session-item">
                  <div className="session-icon">
                    <Globe size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">Network</div>
                    <div className="session-value">{sessionInfo.ipAddress} · {sessionInfo.timezone || '—'}</div>
                  </div>
                </div>
                <div className="session-item">
                  <div className="session-icon">
                    <Monitor size={20} />
                  </div>
                  <div className="session-content">
                    <div className="session-label">Device</div>
                    <div className="session-value">{sessionInfo.device}</div>
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
              {activities.length === 0 && (
                <div className="activity-item">
                  <div className="activity-content">
                    <div className="activity-action">No recent activity</div>
                    <div className="activity-item-name">Orders will appear here as they happen.</div>
                  </div>
                </div>
              )}
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
                <h4 className="settings-section-title">Profile Information</h4>
                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Avatar URL</label>
                      <input
                        type="text"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        placeholder="Enter avatar URL"
                      />
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button className="settings-btn" onClick={() => setShowAvatarModal(true)}>
                          <Edit size={18} />
                          Edit Photo (Crop & Preview)
                        </button>
                        {editForm.avatar && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, color: '#666' }}>Topbar preview:</span>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                              <img src={editForm.avatar} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 65%' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        className="save-btn" 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        style={{ flex: 1 }}
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        className="settings-btn" 
                        onClick={handleEditToggle}
                        style={{ flex: 1 }}
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="settings-btn" onClick={handleEditToggle}>
                    <Edit size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            <div className="settings-section">
              <h4 className="settings-section-title">Security</h4>
              <button className="settings-btn" onClick={() => setShowPasswordModal(true)}>
                <Key size={18} />
                Change Password
              </button>
              <button className="settings-btn" onClick={() => setShowEmailModal(true)}>
                <Mail size={18} />
                Change Email
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 chars)"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn primary" 
                onClick={handlePasswordChange}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Email</h3>
              <button className="modal-close" onClick={() => setShowEmailModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {emailStep === 1 ? (
                <>
                  <p className="modal-info">
                    A verification code will be sent to <strong>vivekjangam73@gmail.com</strong>
                  </p>
                  <div className="form-group">
                    <label>New Email Address</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter new email"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="modal-info">
                    Enter the 6-digit verification code sent to your admin email.
                  </p>
                  <div className="form-group">
                    <label>Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => { setShowEmailModal(false); setEmailStep(1); }}>
                Cancel
              </button>
              {emailStep === 1 ? (
                <button 
                  className="modal-btn primary" 
                  onClick={handleRequestEmailChange}
                  disabled={emailLoading}
                >
                  {emailLoading ? 'Sending...' : 'Send Code'}
                </button>
              ) : (
                <button 
                  className="modal-btn primary" 
                  onClick={handleConfirmEmailChange}
                  disabled={emailLoading}
                >
                  {emailLoading ? 'Verifying...' : 'Verify & Change'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Avatar Editor Modal */}
      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile Photo</h3>
              <button className="modal-close" onClick={() => setShowAvatarModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <AvatarEditor
                initialUrl={editForm.avatar || resolvedProfile.avatar}
                onCancel={() => setShowAvatarModal(false)}
                onSave={async (dataUrl) => {
                  try {
                    const updated = await adminProfileService.uploadAvatar(dataUrl);
                    setAdminProfile(updated);
                    setUser(updated);
                    localStorage.setItem('ec_user', JSON.stringify(updated));
                    setEditForm((prev) => ({ ...prev, avatar: updated?.avatar || prev.avatar }));
                    setToast({ message: 'Photo uploaded successfully', type: 'success' });
                  } catch (err) {
                    setToast({ message: err?.message || 'Failed to upload photo', type: 'error' });
                  } finally {
                    setShowAvatarModal(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
