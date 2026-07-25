import { gql } from '@apollo/client';

export const GET_STAYS = gql`
  query GetStays($filter: StayFilterInput, $page: Int!, $size: Int!) {
    stays(filter: $filter, page: $page, size: $size) {
      totalCount
      hasNextPage
      items {
        id
        name
        about
        propertyType
        isRefundable
        starRating
        daysFromBookingCancellationDeadline
        policiesText
        importantInformation
        startingFromPrice
        address {
          id
          streetAddress
          extendedAddress
          city
          stateProvince
          postalCode
          countryCode
        }
        rooms {
          id
          stayId
          name
          price
          sleeps
          bedroomAmount
          bathrooms
          size
        }
        pictures {
          id
          stayId
          url
          thumbnailUrl
          url1024
          url768
          url512
          caption
          isPrimary
          displayOrder
        }
        host {
          id
        }
        propertyBrand {
          id
        }
        amenities {
          id
        }
        views {
          id
        }
        accessibilities {
          id
        }
        mealPlans {
          id
        }
        paymentTypes {
          id
        }
        travelerExperiences {
          id
        }
        location {
          latitude
          longitude
        }
      }
    }
  }
`;

export const GET_STAY_DETAILS = gql`
  query GetStayDetails($id: Int!) {
    stay(id: $id) {
      id
      name
      about
      propertyType
      isRefundable
      starRating
      daysFromBookingCancellationDeadline
      policiesText
      importantInformation
      startingFromPrice
      address {
        id
        streetAddress
        extendedAddress
        city
        stateProvince
        postalCode
        countryCode
      }
      rooms {
        id
        stayId
        name
        price
        sleeps
        bedroomAmount
        bathrooms
        size
        pictures {
          id
          roomId
          url
          thumbnailUrl
          url1024
          url768
          url512
          caption
          isPrimary
          displayOrder
        }
      }
      pictures {
        id
        stayId
        url
        thumbnailUrl
        url1024
        url768
        url512
        caption
        isPrimary
        displayOrder
      }
      host {
        id
      }
      propertyBrand {
        id
      }
      amenities {
        id
        name
      }
      views {
        id
      }
      accessibilities {
        id
      }
      mealPlans {
        id
      }
      paymentTypes {
        id
      }
      travelerExperiences {
        id
      }
      location {
        latitude
        longitude
      }
    }
  }
`;

export const GET_STAY_PRICE_STATS = gql`
  query GetStayPriceStats($filter: StayFilterInput, $bins: Int) {
    stayPriceStats(filter: $filter, bins: $bins) {
      min
      max
      histogram
    }
  }
`;

// Returns the rooms at a stay that are bookable for the given date range
// (excludes rooms with an overlapping PENDING/CONFIRMED booking). Capacity
// filtering against the traveler count is done client-side against
// Room.sleeps rather than via this query's optional `guests` argument, so
// RoomsSection can distinguish "unavailable for these dates" from "too small
// for this many guests" and badge each case differently.
export const AVAILABLE_ROOMS = gql`
  query AvailableRooms($stayId: Int!, $checkIn: Date!, $checkOut: Date!) {
    availableRooms(stayId: $stayId, checkIn: $checkIn, checkOut: $checkOut) {
      id
    }
  }
`;
