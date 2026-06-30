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

export const GET_REVIEWS_BY_STAY = gql`
  query GetReviewsByStay($stayId: Int!, $page: Int, $size: Int) {
    reviewsByStay(stayId: $stayId, page: $page, size: $size) {
      id
      text
      rating
      stayId
      user {
        id
        name
      }
    }
  }
`;
