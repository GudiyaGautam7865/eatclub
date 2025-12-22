import React, { useState, useEffect } from 'react';
import StatCard from '../../../components/admin/dashboard/StatCard';
import ChartCard from '../../../components/admin/dashboard/ChartCard';
import OrdersChart from '../../../components/admin/dashboard/OrdersChart';
import RevenueChart from '../../../components/admin/dashboard/RevenueChart';
import SalesAreaChart from '../../../components/admin/dashboard/SalesAreaChart';
import CategoryChart from '../../../components/admin/dashboard/CategoryChart';
import TopItemsTable from '../../../components/admin/dashboard/TopItemsTable';
import { getAdminDashboardStats } from '../../../services/adminStatsService';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardStats();
        setStats(data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load dashboard data');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  const dashStats = stats?.stats || {};
  const monthlyOrdersChange = dashStats.monthlyOrders ? Math.round((dashStats.monthlyOrders / (dashStats.totalOrders || 1)) * 100) : 0;
  const monthlyRevenueChange = dashStats.monthlyRevenue && dashStats.totalRevenue ? Math.round((dashStats.monthlyRevenue / dashStats.totalRevenue) * 100) : 0;

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Orders"
          value={dashStats.totalOrders?.toLocaleString() || '0'}
          subtitle={`↑ ${monthlyOrdersChange}% this month (${dashStats.monthlyOrders || 0})`}
          icon="📦"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashStats.totalRevenue || 0)}
          subtitle={`↑ ${monthlyRevenueChange}% this month`}
          icon="💰"
        />
        <StatCard
          title="Total Customers"
          value={(dashStats.totalCustomers || 0).toLocaleString()}
          subtitle={`Active: ${dashStats.totalCustomers || 0}`}
          icon="👥"
        />
        <StatCard
          title="Active Menu Items"
          value={dashStats.activeMenuItems || 0}
          subtitle={`${dashStats.pendingOrders || 0} orders pending`}
          icon="🍽️"
        />
      </div>

      {/* Charts Section - Row 1 */}
      <div className="admin-charts-grid">
        <ChartCard title="📊 Weekly Orders Overview">
          <OrdersChart data={stats?.weeklyData || []} />
        </ChartCard>
        <ChartCard title="📈 Revenue & Orders Trend">
          <RevenueChart data={stats?.weeklyData || []} />
        </ChartCard>
      </div>

      {/* Charts Section - Row 2 */}
      <div className="admin-charts-grid">
        <ChartCard title="⏰ Today's Sales Activity">
          <SalesAreaChart data={stats?.weeklyData || []} />
        </ChartCard>
        <ChartCard title="🎯 Orders by Status">
          <CategoryChart data={stats?.ordersByStatus || []} />
        </ChartCard>
      </div>

      {/* Best Selling Items Section */}
      <div className="admin-section">
        <h2 className="admin-section-title">🏆 Top Performing Items</h2>
        <TopItemsTable items={stats?.bestSellingItems || []} />
      </div>
    </div>
  );
}
