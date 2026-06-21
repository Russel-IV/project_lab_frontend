export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql';

export const API_ENDPOINTS = {
  STAYS: `${BASE_URL}/stays`,
  GRAPHQL: GRAPHQL_URL,
};
