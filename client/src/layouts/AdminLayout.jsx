import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminTopbar from '../components/admin/layout/AdminTopbar';
import '../styles/admin.css';
import Toast from '../components/common/Toast';

export default function AdminLayout() {
  const [authToast, setAuthToast] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminAuthError');
      if (raw) {
        const parsed = JSON.parse(raw);
        setAuthToast(parsed?.message || 'Authorization error');
        localStorage.removeItem('adminAuthError');
      }
    } catch {}
  }, []);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar-container">
        <AdminSidebar />
      </aside>
      <div className="admin-main">
        {authToast && (
          <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }}>
            <Toast
              message={authToast}
              type="warning"
              duration={4000}
              onClose={() => setAuthToast(null)}
            />
          </div>
        )}
        <AdminTopbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
