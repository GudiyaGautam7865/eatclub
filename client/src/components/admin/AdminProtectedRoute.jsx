import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  // Check ONLY admin token
  const adminToken = localStorage.getItem("ec_admin_token");

  // If no token → block access & redirect
  if (!adminToken) {
    return <Navigate to="/" replace />;
  }

  // Otherwise → allow admin to enter
  return children;
}
