import { API_ENDPOINTS } from '@/config/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  profilePictureUrl: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export type SignupResponse = LoginResponse;

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Incorrect email or password.');
    }
    throw new Error('Unable to log in right now. Please try again.');
  }

  return response.json();
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<SignupResponse> {
  const response = await fetch(API_ENDPOINTS.SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('An account with this email already exists.');
    }
    throw new Error('Unable to sign up right now. Please try again.');
  }

  return response.json();
}

export interface ResetPasswordFieldErrors {
  newPassword?: string;
}

export class ResetPasswordValidationError extends Error {
  errors: ResetPasswordFieldErrors;

  constructor(errors: ResetPasswordFieldErrors) {
    super('Password reset validation failed.');
    this.errors = errors;
  }
}

async function parseFieldErrors<TErrors>(
  response: Response,
): Promise<TErrors | null> {
  try {
    const body = await response.json();
    return body?.errors ?? null;
  } catch {
    return null;
  }
}

// The backend always returns 204 whether or not the email exists, so there's
// nothing to branch on here — this only throws on a genuine network/server failure.
export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Unable to send a reset link right now. Please try again.');
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errors = await parseFieldErrors<ResetPasswordFieldErrors>(response);
      if (errors) throw new ResetPasswordValidationError(errors);
    }
    if (response.status === 400) {
      throw new Error('This link is invalid or has expired.');
    }
    throw new Error(
      'Unable to reset your password right now. Please try again.',
    );
  }
}

export async function confirmAccount(token: string): Promise<void> {
  const response = await fetch(API_ENDPOINTS.CONFIRM_ACCOUNT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('This link is invalid or has expired.');
    }
    throw new Error(
      'Unable to confirm your account right now. Please try again.',
    );
  }
}
