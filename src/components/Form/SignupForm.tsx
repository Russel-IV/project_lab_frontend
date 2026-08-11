import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '@/api/auth';
import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';

/**
 * Renders the registration form component.
 */
export const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /**
   * Handles submission of the registration form.
   *
   * @param e - The form event object.
   */
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
    <div className="w-full max-w-md flex flex-col justify-center mx-auto bg-frui-white p-8 sm:p-10 rounded-3xl border border-border shadow-xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-frui-blue text-center mb-8">
        Create an Account
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <input
            id="name"
            type="text"
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3.5 bg-frui-cream border border-transparent rounded-full text-sm text-frui-blue placeholder:text-neutral-400 outline-none focus:border-frui-orange"
          />
        </div>

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
            minLength={8}
            placeholder="Password (min 8 chars)"
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
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-frui-orange-text underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
