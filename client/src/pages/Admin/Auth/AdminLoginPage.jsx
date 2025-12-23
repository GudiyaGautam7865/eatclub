import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAdminAuthenticated } from '../../../services/adminAuthService';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-logo">EatClub Admin</div>
          <div className="admin-login-subtitle">
            Sign in to access the admin dashboard
          </div>
        </div>

        {/* Login Form */}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="admin-form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="admin-form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="admin-login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Login as Admin'}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <p>Admin access only • Authorized personnel</p>
        </div>
      </div>
    </div>
  );
}
