import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useUserContext } from '../../context/UserContext';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
   // ADMIN LOGIN BY EMAIL
if (formData.email === "admin@gmail.com") {
  const res = await fetch("http://localhost:5000/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password
    })
  });

  const result = await res.json();
  console.log("ADMIN LOGIN RESULT:", result);

  if (result.success) {
  localStorage.setItem("ec_admin_token", result.data.token);
  localStorage.setItem("adminToken", result.data.token); // add this
  localStorage.setItem("ec_admin", JSON.stringify(result.data.admin));
  navigate("/admin");
  onClose();
  return;
} else {
    setError("Invalid admin credentials");
    return;
  }
}


    // 🔥 2. NORMAL USER LOGIN
    const response = await login(formData); // now returns data.token + data.user

    if (response.user) {
      setUser(response.user);
      navigate('/');
      onClose();
      return;
    }

    setError("Invalid credentials");
  } catch (err) {
    setError(err.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <h2 className="modal-title">Login</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider"><span>or</span></div>

          <button className="google-btn" disabled={loading}>
            <div className="google-content">
              <div className="google-icon">G</div>
              <span>Sign in with Google</span>
            </div>
          </button>

          <div className="modal-footer">
            <p>Don't have an account? <button type="button" className="link-btn" onClick={onSwitchToSignup}>Register</button></p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LoginModal;