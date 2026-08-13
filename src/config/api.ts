export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql';

export const API_ENDPOINTS = {
  STAYS: `${BASE_URL}/stays`,
  GRAPHQL: GRAPHQL_URL,
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/password-reset/request`,
  RESET_PASSWORD: `${BASE_URL}/auth/password-reset/confirm`,
  CONFIRM_ACCOUNT: `${BASE_URL}/auth/confirm-account`,
  PROFILE: `${BASE_URL}/profile`,
  PROFILE_PICTURE: `${BASE_URL}/profile/picture`,
  PROFILE_PASSWORD: `${BASE_URL}/profile/password`,
  PAYMENT_METHODS: `${BASE_URL}/payment-methods`,
  CHAT: import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080/api/chat',
};
