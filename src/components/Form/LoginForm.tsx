import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';
import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';

/**
 * Renders the login form component.
 */
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /**
   * Handles submission of the login form.
   *
   * @param e - The form event object.
   */
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
    <div className="w-full max-w-md flex flex-col justify-center">
      <h1 className="text-2xl lg:text-3xl font-bold text-frui-blue text-center mb-8">
        Sign in to Frui
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <input
            id="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3.5 bg-frui-cream border border-transparent rounded-full text-sm text-frui-blue placeholder:text-neutral-400 outline-none focus:border-frui-orange"
          />
        </div>

        <div className="relative flex items-center">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3.5 pr-12 bg-frui-cream border border-transparent rounded-full text-sm text-frui-blue placeholder:text-neutral-400 outline-none focus:border-frui-orange"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 text-neutral-400 p-1 select-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between px-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-600 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 accent-frui-orange"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#forgot"
            className="text-neutral-500 hover:text-frui-orange-text underline"
          >
            Forgot Password?
          </a>
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 mt-2 bg-frui-orange text-frui-white font-semibold text-sm rounded-full shadow-md disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-frui-orange-text underline"
          >
            Sign Up now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
