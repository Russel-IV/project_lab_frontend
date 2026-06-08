export type PropertyType = 'HOTEL' | 'HOME';

export interface StayResponse {
  id: number;
  price: number;
  name: string;
  about: string | null;
  propertyType: PropertyType | null;
  streetAddress: string;
  extendedAddress: string | null;
  city: string;
  stateProvince: string | null;
  postalCode: string | null;
  countryCode: string | null;
  isAvailable: boolean;
  isRefundable: boolean;
  starRating: number | null;
  sleeps: number;
  bedroomAmount: number;
  bathrooms: number;
  size: number | null;
  daysFromBookingCancellationDeadline: number | null;
  policiesText: string | null;
  importantInformation: string | null;
  hostId: number;
  propertyBrandId: number | null;
  viewIds: number[];
  amenityIds: number[];
  accessibilityIds: number[];
  mealPlanIds: number[];
  paymentTypeIds: number[];
  travelerExperienceIds: number[];
}

export type StayDto = StayResponse;
