import React from 'react';
import StatCard from '../../../components/admin/dashboard/StatCard';
import ChartCard from '../../../components/admin/dashboard/ChartCard';
import MenuItemsTable from '../../../components/admin/tables/MenuItemsTable';
import OrdersTable from '../../../components/admin/tables/OrdersTable';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>

      {/* Key Stats Cards */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Orders"
          value="1,245"
          subtitle="↑ 12% from last month"
        />
        <StatCard
          title="Total Revenue"
          value="₹3.2L"
          subtitle="↑ 8% from last month"
        />
        <StatCard
          title="Total Customers"
          value="832"
          subtitle="↑ 5% from last month"
        />
        <StatCard
          title="Active Menu Items"
          value="124"
          subtitle="12 items added this month"
        />
      </div>

      {/* Charts Section */}
      <div className="admin-charts-grid">
        <ChartCard title="Orders Overview" />
        <ChartCard title="Revenue Trend" />
      </div>

      {/* Best Selling Items Section */}
      <div className="admin-section">
        <h2 className="admin-section-title">Best Selling Items</h2>
        <MenuItemsTable />
      </div>

      {/* Recent Orders Section */}
      <div className="admin-section">
        <h2 className="admin-section-title">Recent Orders</h2>
        <OrdersTable type="single" />
      </div>
    </div>
  );
}
