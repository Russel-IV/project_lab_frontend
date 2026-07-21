import { useQuery } from '@apollo/client/react';
import {
  GET_DESTINATIONS,
  GET_POPULAR_DESTINATIONS,
  type GetDestinationsQuery,
  type GetDestinationsQueryVariables,
  type GetPopularDestinationsQuery,
  type GetPopularDestinationsQueryVariables,
} from '@/graphql/destinations';
import { useDebouncedValue } from './useDebouncedValue';

export function useDestinations(search: string) {
  const debouncedSearch = useDebouncedValue(search.trim(), 250);

  const { data, loading, error } = useQuery<
    GetDestinationsQuery,
    GetDestinationsQueryVariables
  >(GET_DESTINATIONS, {
    variables: { search: debouncedSearch || null, limit: 20 },
  });

  return { destinations: data?.destinations ?? [], loading, error };
}

export function usePopularDestinations(limit = 8) {
  const { data, loading, error } = useQuery<
    GetPopularDestinationsQuery,
    GetPopularDestinationsQueryVariables
  >(GET_POPULAR_DESTINATIONS, { variables: { limit } });

  return { destinations: data?.popularDestinations ?? [], loading, error };
}
