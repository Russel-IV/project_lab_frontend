import { gql } from '@apollo/client';

export const GET_STAYS = gql`
  query GetStays {
    stays(page: 0, size: 100) {
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
      }
      pictures {
        id
        stayId
        url
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
    }
  }
`;
