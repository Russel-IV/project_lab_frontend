import { gql } from '@apollo/client';

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      checkInDate
      checkOutDate
      status
      guestsCount
      totalPrice
      createdAt
      rooms {
        id
        name
      }
    }
  }
`;

export const MY_BOOKING_STATUS_FOR_STAY = gql`
  query MyBookingStatusForStay($stayId: Int!) {
    myBookingStatusForStay(stayId: $stayId) {
      hasCompletedBooking
    }
  }
`;
