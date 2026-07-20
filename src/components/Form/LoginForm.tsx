import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mountainAndes from '@/assets/images/mountain-andes.webp';
import { login } from '@/api/auth';
import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await login(email, password);
      dispatch(setCredentials({ token, user }));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-card-container">
      {/* Left Column: Image Section */}
      <div className="login-image-section">
        <img src={mountainAndes} alt="Andes Mountain" className="login-image" />
      </div>

      {/* Right Column: Form Section */}
      <div className="login-form-section">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="login-field-container">
            <label htmlFor="email" className="login-field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-field-container">
            <label htmlFor="password" className="login-field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <div className="forgot-password-container">
              <a href="#forgot" className="forgot-password-link">
                forgot password?
              </a>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>

          <p className="auth-switch-text">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
