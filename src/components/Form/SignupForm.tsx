import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '@/api/auth';
import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { signupSchema, type SignupFormValues } from './Schemas/signupSchema';

/**
 * Renders the registration form component using React Hook Form and Zod schema validation.
 */
export const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  /**
   * Handles submission of the registration form after schema validation passes.
   *
   * @param data - Validated form values.
   */
  const onSubmit = async (data: SignupFormValues) => {
    setApiError(null);

    try {
      const { token, user } = await signup(
        data.name,
        data.email,
        data.password,
      );
      dispatch(setCredentials({ token, user }));
      navigate('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to sign up.');
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col justify-center mx-auto bg-frui-white p-8 sm:p-10 rounded-3xl border border-border shadow-xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-frui-blue text-center mb-8">
        Create an Account
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <input
            id="name"
            type="text"
            placeholder="Name"
            {...register('name')}
            className="w-full px-5 py-3.5 bg-frui-cream border border-transparent rounded-full text-sm text-frui-blue placeholder:text-neutral-400 outline-none focus:border-frui-orange"
          />
          {errors.name && (
            <p className="px-3 text-xs text-red-600 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            id="email"
            type="email"
            placeholder="Email"
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
              placeholder="Password (min 8 chars)"
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
