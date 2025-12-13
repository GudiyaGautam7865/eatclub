import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminTopbar from '../components/admin/layout/AdminTopbar';
import '../styles/admin.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar-container">
        <AdminSidebar />
      </aside>
      <div className="admin-main">
        <AdminTopbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
