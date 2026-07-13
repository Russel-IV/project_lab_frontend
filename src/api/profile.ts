import { API_ENDPOINTS } from '@/config/api';

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profilePictureUrl: string | null;
}

export interface ProfileFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export class ProfileValidationError extends Error {
  errors: ProfileFieldErrors;

  constructor(errors: ProfileFieldErrors) {
    super('Profile validation failed.');
    this.errors = errors;
  }
}

// Thrown for a 401 on any authenticated call below — a stale/expired token
// left in localStorage looks identical to a network failure otherwise, and
// retrying never succeeds since the token stays invalid.
export class UnauthorizedError extends Error {
  constructor() {
    super('Your session has expired. Please log in again.');
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

export async function getProfile(token: string): Promise<ProfileResponse> {
  const response = await fetch(API_ENDPOINTS.PROFILE, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    throw new Error('Unable to load your profile right now. Please try again.');
  }

  return response.json();
}

export async function updateProfile(
  token: string,
  input: { name: string; email: string; phone: string },
): Promise<ProfileResponse> {
  const response = await fetch(API_ENDPOINTS.PROFILE, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    if (response.status === 422) {
      const errors = await parseFieldErrors<ProfileFieldErrors>(response);
      if (errors) throw new ProfileValidationError(errors);
    }
    throw new Error('Unable to save your profile right now. Please try again.');
  }

  return response.json();
}

export async function uploadProfilePicture(
  token: string,
  file: File,
): Promise<{ profilePictureUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_ENDPOINTS.PROFILE_PICTURE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    throw new Error(
      'Unable to upload your profile picture right now. Please try again.',
    );
  }

  return response.json();
}

export interface ChangePasswordFieldErrors {
  currentPassword?: string;
  newPassword?: string;
}

export class ChangePasswordValidationError extends Error {
  errors: ChangePasswordFieldErrors;

  constructor(errors: ChangePasswordFieldErrors) {
    super('Change password validation failed.');
    this.errors = errors;
  }
}

export async function changePassword(
  token: string,
  input: { currentPassword: string; newPassword: string },
): Promise<void> {
  const response = await fetch(API_ENDPOINTS.PROFILE_PASSWORD, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    if (response.status === 422) {
      const errors =
        await parseFieldErrors<ChangePasswordFieldErrors>(response);
      if (errors) throw new ChangePasswordValidationError(errors);
    }
    throw new Error(
      'Unable to change your password right now. Please try again.',
    );
  }
}

export async function deleteAccount(token: string): Promise<void> {
  const response = await fetch(API_ENDPOINTS.PROFILE, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    throw new Error(
      'Unable to delete your account right now. Please try again.',
    );
  }
}

export interface PaymentMethodResponse {
  id: number;
  stripePaymentMethodId: string;
  brand: string;
  lastFour: string;
  type: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface PaymentMethodFieldErrors {
  cardNumber?: string;
  expiryYear?: string;
}

export class PaymentMethodValidationError extends Error {
  errors: PaymentMethodFieldErrors;

  constructor(errors: PaymentMethodFieldErrors) {
    super('Payment method validation failed.');
    this.errors = errors;
  }
}

export async function getPaymentMethods(
  token: string,
): Promise<PaymentMethodResponse[]> {
  const response = await fetch(API_ENDPOINTS.PAYMENT_METHODS, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    throw new Error(
      'Unable to load your payment methods right now. Please try again.',
    );
  }

  return response.json();
}

export async function savePaymentMethod(
  token: string,
  input: {
    cardholderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  },
): Promise<PaymentMethodResponse> {
  const response = await fetch(API_ENDPOINTS.PAYMENT_METHODS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    if (response.status === 422) {
      const errors = await parseFieldErrors<PaymentMethodFieldErrors>(response);
      if (errors) throw new PaymentMethodValidationError(errors);
    }
    throw new Error(
      'Unable to save this payment method right now. Please try again.',
    );
  }

  return response.json();
}

export async function setDefaultPaymentMethod(
  token: string,
  id: number,
): Promise<void> {
  const response = await fetch(
    `${API_ENDPOINTS.PAYMENT_METHODS}/${id}/default`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    throw new Error(
      'Unable to set this payment method as primary right now. Please try again.',
    );
  }
}

export async function deletePaymentMethod(
  token: string,
  id: number,
): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.PAYMENT_METHODS}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) throw new UnauthorizedError();
    throw new Error(
      'Unable to remove this payment method right now. Please try again.',
    );
  }
}
