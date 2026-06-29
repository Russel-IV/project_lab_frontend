import { gql } from '@apollo/client';

export const GET_REVIEWS = gql`
  query GetReviews($page: Int, $size: Int) {
    reviews(page: $page, size: $size) {
      id
      text
      userId
      stayId
    }
  }
`;
