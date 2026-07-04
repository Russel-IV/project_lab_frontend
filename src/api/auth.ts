import { API_ENDPOINTS } from '@/config/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
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
