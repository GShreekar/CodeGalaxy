// src/pages/LoginPage.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../features/authSlice';
import './AuthPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear errors when component unmounts
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    setErrors(prev => ({ ...prev, [name]: '', submit: '' }));
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (error) {
      setErrors({ submit: error });
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
                name="username"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            {(errors.submit || error) && (
              <div className="alert alert-danger">
                {errors.submit || error}
              </div>
            )}
            <button 
              type="submit" 
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
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