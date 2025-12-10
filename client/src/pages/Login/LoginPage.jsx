import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useUserContext } from '../../context/UserContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      if (response.user) {
        setUser(response.user);
        
        // Check role from backend response first
        if (response.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Fallback for dev compatibility
        if (formData.email === 'admin@gmail.com' && formData.password === '1260') {
          localStorage.setItem('isAdminAuthenticated', 'true');
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // UI only - no actual Google integration
    console.log('Google sign-in clicked');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/logo.png" alt="EatClub" />
          </Link>
        </div>

        <div className="login-form-container">
          <h1 className="login-title">Login</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button 
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <div className="google-btn-content">
              <div className="google-icon">G</div>
              <span>Sign in with Google</span>
            </div>
          </button>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup" className="signup-link">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;