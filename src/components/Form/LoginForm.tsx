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

          <div className="social-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login-group">
            <button
              type="button"
              className="social-btn"
              aria-label="Google Sign In"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            </button>
            <button
              type="button"
              className="social-btn text-[#1877F2]"
              aria-label="Facebook Sign In"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </button>
            <button
              type="button"
              className="social-btn text-[#181717]"
              aria-label="GitHub Sign In"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
