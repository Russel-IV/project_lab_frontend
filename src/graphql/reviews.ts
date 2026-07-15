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

export const GET_REVIEW_SUMMARY = gql`
  query GetReviewSummary($stayId: Int!) {
    reviewSummary(stayId: $stayId) {
      count
      average
      oneStar
      twoStar
      threeStar
      fourStar
      fiveStar
    }
  }
`;

export const MY_REVIEW_FOR_STAY = gql`
  query MyReviewForStay($stayId: Int!) {
    myReviewForStay(stayId: $stayId) {
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

export const MY_REVIEWS = gql`
  query MyReviews($page: Int, $size: Int) {
    myReviews(page: $page, size: $size) {
      id
      text
      rating
      stayId
      stay {
        id
        name
        address {
          city
          stateProvince
        }
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
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

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: Int!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
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

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: Int!) {
    deleteReview(id: $id)
  }
`;
