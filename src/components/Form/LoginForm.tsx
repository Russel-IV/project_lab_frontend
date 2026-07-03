import React, { useState } from 'react';
import mountainAndes from '@/assets/images/mountain-andes.jpg';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Attempting to sign in with:\nEmail: ${email}`);
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

          <button type="submit" className="login-submit-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
