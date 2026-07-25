/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** Lifecycle state of a booking. */
export type BookingStatus = 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'PENDING';

/** Input for creating a new booking. The booking is associated with the authenticated user. */
export type CreateBookingInput = {
  /** Desired check-in date. */
  checkInDate: unknown;
  /** Desired check-out date. Must be after `checkInDate`. */
  checkOutDate: unknown;
  /** Number of guests. */
  guestsCount: number;
  /** ID of a payment intent previously created via createPaymentIntent, for the same rooms/dates/guests. Verified server-side before the booking is created. */
  paymentIntentId: string;
  /** IDs of the rooms to include in the booking. */
  roomIds: Array<number>;
};

/** Input for creating a payment intent prior to booking. Card payments only, always captured immediately — there is no pay-later/manual-capture path. */
export type CreatePaymentIntentInput = {
  /** Desired check-in date. */
  checkInDate: unknown;
  /** Desired check-out date. Must be after `checkInDate`. */
  checkOutDate: unknown;
  /** Number of guests. */
  guestsCount: number;
  /** Client-generated key. Retrying createPaymentIntent with the same key returns the original intent instead of creating a duplicate. */
  idempotencyKey: string;
  /** IDs of the rooms to include in the booking. */
  roomIds: Array<number>;
};

/** Input for submitting a review. */
export type CreateReviewInput = {
  /** Rating from 1 (lowest) to 5 (highest). */
  rating: number;
  /** ID of the stay being reviewed. */
  stayId: number;
  /** The written review content. */
  text: string;
};

/** The type of property (hotel chain or private home). */
export type PropertyType = 'HOME' | 'HOTEL';

/** Search and availability filter for the stays query. All fields are optional and combined with AND logic. */
export type StayFilterInput = {
  /** Limit results to properties with a room having one of these bedroom counts. Use 4 to mean 4 or more bedrooms. */
  bedrooms?: Array<number> | null | undefined;
  /** Availability check start date. Must be provided together with checkOut. */
  checkIn?: unknown;
  /** Availability check end date. Must be provided together with checkIn. */
  checkOut?: unknown;
  /** Limit results to stays the authenticated caller has favorited. Combined with every other filter field via AND, same as isRefundable. Requires authentication to have any effect — an unauthenticated caller gets zero results rather than a GraphQL error. */
  favoritesOnly?: boolean | null | undefined;
  /** Minimum number of guests that at least one available room must accommodate. */
  guests?: number | null | undefined;
  /** Limit results to properties eligible for a full refund on cancellation. */
  isRefundable?: boolean | null | undefined;
  /** Require at least one room with a nightly rate at or below this amount. */
  maxPricePerNight?: number | null | undefined;
  /** Require at least one room with a nightly rate at or above this amount. */
  minPricePerNight?: number | null | undefined;
  /** Limit results to properties offering ALL of these property-level amenities (e.g. Wi-Fi, pool, parking, gym, pet-friendly). */
  propertyAmenityIds?: Array<number> | null | undefined;
  /** Limit results to a specific property category. */
  propertyType?: PropertyType | null | undefined;
  /** Stable destination identifier (docs/adr/0018) — the preferred replacement for city/countryCode, immune to same-name-different-region collisions. */
  regionId?: number | null | undefined;
  /** Limit results to properties offering ALL of these in-room amenities (e.g. air conditioning, kitchen, balcony, private bathroom, washer) somewhere on the property. */
  roomAmenityIds?: Array<number> | null | undefined;
  /** Limit results to properties with one of these star rating tiers (1-5). A property matches a tier if its starRating rounds to it. */
  starRatings?: Array<number> | null | undefined;
};

/** Input for updating an existing review. */
export type UpdateReviewInput = {
  /** Updated rating from 1 (lowest) to 5 (highest). */
  rating: number;
  /** ID of the stay being reviewed. */
  stayId: number;
  /** Updated review text. */
  text: string;
};

export type CreateBookingMutationVariables = Exact<{
  input: CreateBookingInput;
}>;

export type CreateBookingMutation = {
  createBooking: {
    __typename: 'Booking';
    id: number;
    checkInDate: unknown;
    checkOutDate: unknown;
    status: BookingStatus;
    guestsCount: number;
    totalPrice: number;
    createdAt: unknown;
    rooms: Array<{ __typename: 'Room'; id: number; name: string }>;
  };
};

export type MyBookingStatusForStayQueryVariables = Exact<{
  stayId: number;
}>;

export type MyBookingStatusForStayQuery = {
  myBookingStatusForStay: {
    __typename: 'BookingStatusForStay';
    hasCompletedBooking: boolean;
  };
};

export type MyBookingsQueryVariables = Exact<{
  page?: number | null | undefined;
  size?: number | null | undefined;
}>;

export type MyBookingsQuery = {
  myBookings: Array<{
    __typename: 'Booking';
    id: number;
    checkInDate: unknown;
    checkOutDate: unknown;
    status: BookingStatus;
    guestsCount: number;
    totalPrice: number;
    createdAt: unknown;
    rooms: Array<{
      __typename: 'Room';
      id: number;
      stayId: number;
      name: string;
    }>;
  }>;
};

export type DeleteBookingMutationVariables = Exact<{
  id: number;
}>;

export type DeleteBookingMutation = { deleteBooking: boolean };

export type GetDestinationsQueryVariables = Exact<{
  search?: string | null | undefined;
  limit?: number | null | undefined;
}>;

export type GetDestinationsQuery = {
  destinations: Array<{
    __typename: 'Destination';
    city: string;
    countryCode: string;
    regionId: number;
  }>;
};

export type GetPopularDestinationsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;

export type GetPopularDestinationsQuery = {
  popularDestinations: Array<{
    __typename: 'Destination';
    city: string;
    countryCode: string;
    regionId: number;
  }>;
};

export type MyFavoriteStayIdsQueryVariables = Exact<{ [key: string]: never }>;

export type MyFavoriteStayIdsQuery = { myFavoriteStayIds: Array<number> };

export type AddFavoriteMutationVariables = Exact<{
  stayId: number;
}>;

export type AddFavoriteMutation = { addFavorite: boolean };

export type RemoveFavoriteMutationVariables = Exact<{
  stayId: number;
}>;

export type RemoveFavoriteMutation = { removeFavorite: boolean };

export type CreatePaymentIntentMutationVariables = Exact<{
  input: CreatePaymentIntentInput;
}>;

export type CreatePaymentIntentMutation = {
  createPaymentIntent: {
    __typename: 'PaymentIntentPayload';
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
  };
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

export type MyReviewForStayQueryVariables = Exact<{
  stayId: number;
}>;

export type MyReviewForStayQuery = {
  myReviewForStay: {
    __typename: 'Review';
    id: number;
    text: string;
    rating: number;
    stayId: number;
    user: { __typename: 'User'; id: number; name: string };
  } | null;
};

export type MyReviewsQueryVariables = Exact<{
  page?: number | null | undefined;
  size?: number | null | undefined;
}>;

export type MyReviewsQuery = {
  myReviews: Array<{
    __typename: 'Review';
    id: number;
    text: string;
    rating: number;
    stayId: number;
    stay: {
      __typename: 'Stay';
      id: number;
      publicId: string;
      name: string;
      address: {
        __typename: 'Address';
        city: string;
        stateProvince: string | null;
      };
    };
  }>;
};

export type CreateReviewMutationVariables = Exact<{
  input: CreateReviewInput;
}>;

export type CreateReviewMutation = {
  createReview: {
    __typename: 'Review';
    id: number;
    text: string;
    rating: number;
    stayId: number;
    user: { __typename: 'User'; id: number; name: string };
  };
};

export type UpdateReviewMutationVariables = Exact<{
  id: number;
  input: UpdateReviewInput;
}>;

export type UpdateReviewMutation = {
  updateReview: {
    __typename: 'Review';
    id: number;
    text: string;
    rating: number;
    stayId: number;
    user: { __typename: 'User'; id: number; name: string };
  };
};

export type DeleteReviewMutationVariables = Exact<{
  id: number;
}>;

export type DeleteReviewMutation = { deleteReview: boolean };

export type GetStaysQueryVariables = Exact<{
  filter?: StayFilterInput | null | undefined;
  page: number;
  size: number;
}>;

export type GetStaysQuery = {
  stays: {
    __typename: 'StayConnection';
    totalCount: number;
    hasNextPage: boolean;
    items: Array<{
      __typename: 'Stay';
      id: number;
      publicId: string;
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
        thumbnailUrl: string;
        url1024: string | null;
        url768: string | null;
        url512: string | null;
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
};

export type StayDetailsFieldsFragment = {
  __typename: 'Stay';
  id: number;
  publicId: string;
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
    pictures: Array<{
      __typename: 'RoomPicture';
      id: number;
      roomId: number;
      url: string;
      thumbnailUrl: string;
      url1024: string | null;
      url768: string | null;
      url512: string | null;
      caption: string | null;
      isPrimary: boolean;
      displayOrder: number;
    }>;
    amenities: Array<{ __typename: 'Amenity'; id: number; name: string }>;
  }>;
  pictures: Array<{
    __typename: 'StayPicture';
    id: number;
    stayId: number;
    url: string;
    thumbnailUrl: string;
    url1024: string | null;
    url768: string | null;
    url512: string | null;
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
  travelerExperiences: Array<{ __typename: 'TravelerExperience'; id: number }>;
  location: {
    __typename: 'Location';
    latitude: number;
    longitude: number;
  } | null;
};

export type GetStayDetailsQueryVariables = Exact<{
  id: number;
}>;

export type GetStayDetailsQuery = {
  stay: {
    __typename: 'Stay';
    id: number;
    publicId: string;
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
      pictures: Array<{
        __typename: 'RoomPicture';
        id: number;
        roomId: number;
        url: string;
        thumbnailUrl: string;
        url1024: string | null;
        url768: string | null;
        url512: string | null;
        caption: string | null;
        isPrimary: boolean;
        displayOrder: number;
      }>;
      amenities: Array<{ __typename: 'Amenity'; id: number; name: string }>;
    }>;
    pictures: Array<{
      __typename: 'StayPicture';
      id: number;
      stayId: number;
      url: string;
      thumbnailUrl: string;
      url1024: string | null;
      url768: string | null;
      url512: string | null;
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

export type GetStayDetailsByPublicIdQueryVariables = Exact<{
  publicId: string | number;
}>;

export type GetStayDetailsByPublicIdQuery = {
  stay: {
    __typename: 'Stay';
    id: number;
    publicId: string;
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
      pictures: Array<{
        __typename: 'RoomPicture';
        id: number;
        roomId: number;
        url: string;
        thumbnailUrl: string;
        url1024: string | null;
        url768: string | null;
        url512: string | null;
        caption: string | null;
        isPrimary: boolean;
        displayOrder: number;
      }>;
      amenities: Array<{ __typename: 'Amenity'; id: number; name: string }>;
    }>;
    pictures: Array<{
      __typename: 'StayPicture';
      id: number;
      stayId: number;
      url: string;
      thumbnailUrl: string;
      url1024: string | null;
      url768: string | null;
      url512: string | null;
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

export type GetStayPriceStatsQueryVariables = Exact<{
  filter?: StayFilterInput | null | undefined;
  bins?: number | null | undefined;
}>;

export type GetStayPriceStatsQuery = {
  stayPriceStats: {
    __typename: 'StayPriceStats';
    min: number | null;
    max: number | null;
    histogram: Array<number>;
  };
};

export type AvailableRoomsQueryVariables = Exact<{
  stayId: number;
  checkIn: unknown;
  checkOut: unknown;
}>;

export type AvailableRoomsQuery = {
  availableRooms: Array<{ __typename: 'Room'; id: number }>;
};
