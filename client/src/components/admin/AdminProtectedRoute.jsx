import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  // Check admin token OR user role === ADMIN
  const adminToken = localStorage.getItem('ec_admin_token');
  let isAdminRole = false;
  try {
    const rawUser = localStorage.getItem('ec_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      isAdminRole = (user?.role === 'ADMIN');
    }
  } catch {}
  
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('ec_user')) || null;
    } catch {
      return null;
    }
  })();

  const isAdminAuthenticated = (() => {
    try {
      return localStorage.getItem('isAdminAuthenticated') === 'true';
    } catch {
      return false;
    }
  })();
  const isAdmin = Boolean(adminToken) || (user && user.role === 'ADMIN') || isAdminAuthenticated;
  
  if (!isAdmin) {
    // Persist a friendly message for global toast
    try {
      localStorage.setItem('adminAuthError', JSON.stringify({
        message: 'Admin access required',
        status: 403,
        at: Date.now(),
      }));
    } catch {}
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
