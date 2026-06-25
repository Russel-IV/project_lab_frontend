/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type PropertyType = 'HOME' | 'HOTEL';

export type GetStaysQueryVariables = Exact<{ [key: string]: never }>;

export type GetStaysQuery = {
  stays: Array<{
    __typename: 'Stay';
    id: number;
    name: string;
    about: string | null;
    propertyType: PropertyType;
    isRefundable: boolean;
    starRating: unknown;
    daysFromBookingCancellationDeadline: number | null;
    policiesText: string | null;
    importantInformation: string | null;
    startingFromPrice: unknown;
    address: {
      __typename: 'Address';
      id: number;
      streetAddress: string;
      extendedAddress: string | null;
      city: string;
      stateProvince: string | null;
      postalCode: string | null;
      countryCode: string;
    };
    rooms: Array<{
      __typename: 'Room';
      id: number;
      stayId: number;
      name: string;
      price: unknown;
      sleeps: number;
      bedroomAmount: number;
      bathrooms: unknown;
      size: unknown;
    }>;
    pictures: Array<{
      __typename: 'StayPicture';
      id: number;
      stayId: number;
      url: string;
      caption: string | null;
      isPrimary: boolean;
      displayOrder: number;
    }>;
    host: { __typename: 'Host'; id: number };
    propertyBrand: { __typename: 'PropertyBrand'; id: number } | null;
    amenities: Array<{ __typename: 'Amenity'; id: number }>;
    views: Array<{ __typename: 'View'; id: number }>;
    accessibilities: Array<{ __typename: 'Accessibility'; id: number }>;
    mealPlans: Array<{ __typename: 'MealPlan'; id: number }>;
    paymentTypes: Array<{ __typename: 'PaymentType'; id: number }>;
    travelerExperiences: Array<{
      __typename: 'TravelerExperience';
      id: number;
    }>;
  }>;
};
