// src/pages/LoginPage.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import './AuthPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (error) {
      setErrors((PrevErrors) => ({
        ...PrevErrors,
        submit: error.message || 'An error occurred. Please try again.',
      }));
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="card-body">
          <h2 className="card-title text-center neon-text mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
            </button>
          </form>
          <p className="text-center mb-0">
            New user? <Link to="/register" className="neon-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;