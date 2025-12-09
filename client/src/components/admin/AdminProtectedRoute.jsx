import { Navigate } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminProtectedRoute({ children }) {
  const isAuthenticated = adminAuthService.isAdminAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
