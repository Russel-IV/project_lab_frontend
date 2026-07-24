import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import type { FieldPolicy, Reference } from '@apollo/client/cache';
import { GRAPHQL_URL } from '@/config/api';

interface StayConnectionShape {
  items: Reference[];
  totalCount: number;
  hasNextPage: boolean;
}

const staysFieldPolicy: FieldPolicy<StayConnectionShape> = {
  keyArgs: ['filter'],
  merge(existing, incoming, { args }) {
    if (!existing || !args || args.page === 0) {
      return incoming;
    }
    return {
      ...incoming,
      items: [...existing.items, ...incoming.items],
    };
  },
};

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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          stays: staysFieldPolicy,
        },
      },
    },
  }),
});
