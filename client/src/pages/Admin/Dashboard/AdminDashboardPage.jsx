import React from 'react';
import StatCard from '../../../components/admin/dashboard/StatCard';
import ChartCard from '../../../components/admin/dashboard/ChartCard';
import OrdersChart from '../../../components/admin/dashboard/OrdersChart';
import RevenueChart from '../../../components/admin/dashboard/RevenueChart';
import SalesAreaChart from '../../../components/admin/dashboard/SalesAreaChart';
import CategoryChart from '../../../components/admin/dashboard/CategoryChart';
import TopItemsTable from '../../../components/admin/dashboard/TopItemsTable';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
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
          value="1,245"
          subtitle="↑ 12% from last month"
          icon="📦"
        />
        <StatCard
          title="Total Revenue"
          value="₹3.2L"
          subtitle="↑ 8% from last month"
          icon="💰"
        />
        <StatCard
          title="Total Customers"
          value="832"
          subtitle="↑ 5% from last month"
          icon="👥"
        />
        <StatCard
          title="Active Menu Items"
          value="124"
          subtitle="12 items added this month"
          icon="🍽️"
        />
      </div>

      {/* Charts Section - Row 1 */}
      <div className="admin-charts-grid">
        <ChartCard title="📊 Weekly Orders Overview">
          <OrdersChart />
        </ChartCard>
        <ChartCard title="📈 Revenue & Orders Trend">
          <RevenueChart />
        </ChartCard>
      </div>

      {/* Charts Section - Row 2 */}
      <div className="admin-charts-grid">
        <ChartCard title="⏰ Today's Sales Activity">
          <SalesAreaChart />
        </ChartCard>
        <ChartCard title="🎯 Orders by Category">
          <CategoryChart />
        </ChartCard>
      </div>

      {/* Best Selling Items Section */}
      <div className="admin-section">
        <h2 className="admin-section-title">🏆 Top Performing Items</h2>
        <TopItemsTable />
      </div>
    </div>
  );
}
