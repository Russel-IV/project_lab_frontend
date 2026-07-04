import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mountainAndes from '@/assets/images/mountain-andes.jpg';
import { signup } from '@/api/auth';
import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import './LoginForm.css';

export const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
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
      const { token, user } = await signup(name, email, password);
      dispatch(setCredentials({ token, user }));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up.');
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
        <h2 className="login-title">Sign Up</h2>

        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="login-field-container">
            <label htmlFor="name" className="login-field-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input"
            />
          </div>

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
              minLength={8}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
