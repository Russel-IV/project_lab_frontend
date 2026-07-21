import { gql } from '@apollo/client';

export interface Destination {
  __typename: 'Destination';
  city: string;
  countryCode: string;
  regionId: number;
}

export interface GetDestinationsQuery {
  destinations: Destination[];
}

export interface GetDestinationsQueryVariables {
  search?: string | null;
  limit?: number;
}

export const GET_DESTINATIONS = gql`
  query GetDestinations($search: String, $limit: Int) {
    destinations(search: $search, limit: $limit) {
      city
      countryCode
      regionId
    }
  }
`;

export interface GetPopularDestinationsQuery {
  popularDestinations: Destination[];
}

export interface GetPopularDestinationsQueryVariables {
  limit?: number;
}

export const GET_POPULAR_DESTINATIONS = gql`
  query GetPopularDestinations($limit: Int) {
    popularDestinations(limit: $limit) {
      city
      countryCode
      regionId
    }
  }
`;
