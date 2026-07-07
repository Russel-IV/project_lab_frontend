/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** The type of property (hotel chain or private home). */
export type PropertyType = 'HOME' | 'HOTEL';

/** Search and availability filter for the stays query. All fields are optional and combined with AND logic. */
export type StayFilterInput = {
  /** Availability check start date. Must be provided together with checkOut. */
  checkIn?: unknown;
  /** Availability check end date. Must be provided together with checkIn. */
  checkOut?: unknown;
  /** Case-insensitive city name substring match. */
  city?: string | null | undefined;
  /** Exact ISO 3166-1 alpha-2 country code match (e.g. 'US', 'GB'). */
  countryCode?: string | null | undefined;
  /** Minimum number of guests that at least one available room must accommodate. */
  guests?: number | null | undefined;
  /** Require at least one room with a nightly rate at or below this amount. */
  maxPricePerNight?: number | null | undefined;
  /** Require at least one room with a nightly rate at or above this amount. */
  minPricePerNight?: number | null | undefined;
  /** Limit results to a specific property category. */
  propertyType?: PropertyType | null | undefined;
};

export type GetReviewsQueryVariables = Exact<{
  page?: number | null | undefined;
  size?: number | null | undefined;
}>;

export type GetReviewsQuery = {
  reviews: Array<{
    __typename: 'Review';
    id: number;
    text: string;
    userId: number;
    stayId: number;
  }>;
};

export type GetReviewsByStayQueryVariables = Exact<{
  stayId: number;
  page?: number | null | undefined;
  size?: number | null | undefined;
}>;

export type GetReviewsByStayQuery = {
  reviewsByStay: Array<{
    __typename: 'Review';
    id: number;
    text: string;
    rating: number;
    stayId: number;
    user: { __typename: 'User'; id: number; name: string };
  }>;
};

export type GetReviewSummaryQueryVariables = Exact<{
  stayId: number;
}>;

export type GetReviewSummaryQuery = {
  reviewSummary: {
    __typename: 'ReviewSummary';
    count: number;
    average: number | null;
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
};

export type GetStaysQueryVariables = Exact<{
  filter?: StayFilterInput | null | undefined;
}>;

export type GetStaysQuery = {
  stays: Array<{
    __typename: 'Stay';
    id: number;
    name: string;
    about: string | null;
    propertyType: PropertyType;
    isRefundable: boolean;
    starRating: number | null;
    daysFromBookingCancellationDeadline: number | null;
    policiesText: string | null;
    importantInformation: string | null;
    startingFromPrice: number | null;
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
      price: number;
      sleeps: number;
      bedroomAmount: number;
      bathrooms: number;
      size: number | null;
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
    location: {
      __typename: 'Location';
      latitude: number;
      longitude: number;
    } | null;
  }>;
};

export type GetStayDetailsQueryVariables = Exact<{
  id: number;
}>;

export type GetStayDetailsQuery = {
  stay: {
    __typename: 'Stay';
    id: number;
    name: string;
    about: string | null;
    propertyType: PropertyType;
    isRefundable: boolean;
    starRating: number | null;
    daysFromBookingCancellationDeadline: number | null;
    policiesText: string | null;
    importantInformation: string | null;
    startingFromPrice: number | null;
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
      price: number;
      sleeps: number;
      bedroomAmount: number;
      bathrooms: number;
      size: number | null;
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
    amenities: Array<{ __typename: 'Amenity'; id: number; name: string }>;
    views: Array<{ __typename: 'View'; id: number }>;
    accessibilities: Array<{ __typename: 'Accessibility'; id: number }>;
    mealPlans: Array<{ __typename: 'MealPlan'; id: number }>;
    paymentTypes: Array<{ __typename: 'PaymentType'; id: number }>;
    travelerExperiences: Array<{
      __typename: 'TravelerExperience';
      id: number;
    }>;
    location: {
      __typename: 'Location';
      latitude: number;
      longitude: number;
    } | null;
  } | null;
};
