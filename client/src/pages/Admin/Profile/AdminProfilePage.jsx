import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../../services/adminAuthService';
import { getAdminDashboardStats } from '../../../services/adminStatsService';
import { useUserContext } from '../../../context/UserContext';
import { 
  User, Mail, Shield, Calendar, Clock, Globe, Monitor,
  Package, DollarSign, Users, Utensils, TrendingUp,
  CheckCircle, Edit, Trash2, UserPlus, Lock, Settings,
  Activity, LogOut, Key, Zap
} from 'lucide-react';
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardStats();
        setDashboard(data);
      } catch (err) {
        console.error('Failed to load admin dashboard stats', err);
        setError(err?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    try {
      const storedUserRaw = localStorage.getItem('ec_user');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      const profile = user?.role === 'ADMIN'
        ? user
        : storedUser?.role === 'ADMIN'
          ? storedUser
          : null;
      setAdminProfile(profile);
    } catch {
      setAdminProfile(user?.role === 'ADMIN' ? user : null);
    }
  }, [user]);

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

  const formatDateTime = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleString();
    } catch (err) {
      console.error('Failed to format date', err);
      return '—';
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
              <User size={56} />
            </div>
            <div className="profile-status-badge"></div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">{adminProfile?.name || 'Admin'}</h1>
            <p className="profile-hero-email">
              <Mail size={16} />
              {adminProfile?.email || 'admin@eatclub.com'}
            </p>
            <div className="profile-badges">
              <span className="profile-badge primary">
                <Shield size={14} />
                {adminProfile?.role === 'ADMIN' ? 'Super Admin' : adminProfile?.role || 'Admin'}
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
                  <span className="profile-info-value">{adminProfile?.name || '—'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{adminProfile?.email || '—'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Role</span>
                  <span className="profile-info-value">{adminProfile?.role === 'ADMIN' ? 'Administrator' : adminProfile?.role || '—'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Status</span>
                  <span className={`profile-info-badge ${adminProfile?.isActive === false ? 'inactive' : 'active'}`}>
                    {adminProfile?.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Member Since</span>
                  <span className="profile-info-value">{formatDateTime(adminProfile?.createdAt || sessionInfo.loginTime)}</span>
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
