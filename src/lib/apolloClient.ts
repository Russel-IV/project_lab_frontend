import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { GRAPHQL_URL } from '@/config/api';

// Reads the JWT the same way authSlice persists it (see src/store/authSlice.ts)
// rather than importing the Redux store here, to avoid a circular import
// between the store and the Apollo client.
const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: GRAPHQL_URL })]),
  cache: new InMemoryCache(),
});
