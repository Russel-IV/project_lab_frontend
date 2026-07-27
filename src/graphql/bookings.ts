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

export const MY_BOOKINGS = gql`
  query MyBookings($page: Int, $size: Int) {
    myBookings(page: $page, size: $size) {
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
        stay {
          publicId
          name
        }
      }
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: Int!) {
    deleteBooking(id: $id)
  }
`;
