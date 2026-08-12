import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';
import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { loginSchema, type LoginFormValues } from './Schemas/loginSchema';

/**
 * Renders the login form component using React Hook Form and Zod schema validation.
 */
export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Handles submission of the login form after schema validation passes.
   *
   * @param data - Validated form values.
   */
  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);

    try {
      const { token, user } = await login(data.email, data.password);
      dispatch(setCredentials({ token, user }));
      navigate('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to log in.');
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col justify-center">
      <h1 className="text-2xl lg:text-3xl font-bold text-frui-blue text-center mb-8">
        Sign in to Frui
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register('email')}
            className="w-full px-5 py-3.5 bg-frui-cream border border-transparent rounded-full text-sm text-frui-blue placeholder:text-neutral-400 outline-none focus:border-frui-orange"
          />
          {errors.email && (
            <p className="px-3 text-xs text-red-600 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              {...register('password')}
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
          {errors.password && (
            <p className="px-3 text-xs text-red-600 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between px-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-600 select-none">
            <input
              type="checkbox"
              {...register('rememberMe')}
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

        {apiError && (
          <p className="text-xs text-red-600 font-medium text-center">
            {apiError}
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
