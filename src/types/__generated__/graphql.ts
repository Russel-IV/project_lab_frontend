type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type BookingStatus = 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'PENDING';

export type CreateBookingInput = {
  checkInDate: unknown;
  checkOutDate: unknown;
  guestsCount: number;
  paymentIntentId: string;
  roomIds: Array<number>;
};

export type CreatePaymentIntentInput = {
  checkInDate: unknown;
  checkOutDate: unknown;
  guestsCount: number;
  idempotencyKey: string;
  roomIds: Array<number>;
};

export type CreateReviewInput = {
  rating: number;
  stayId: number;
  text: string;
};

export type PropertyType = 'HOME' | 'HOTEL';

export type StayFilterInput = {
  bedrooms?: Array<number> | null | undefined;
  checkIn?: unknown;
  checkOut?: unknown;
  guests?: number | null | undefined;
  isRefundable?: boolean | null | undefined;
  maxPricePerNight?: number | null | undefined;
  minPricePerNight?: number | null | undefined;
  propertyAmenityIds?: Array<number> | null | undefined;
  propertyType?: PropertyType | null | undefined;
  regionId?: number | null | undefined;
  roomAmenityIds?: Array<number> | null | undefined;
  starRatings?: Array<number> | null | undefined;
};

export type UpdateReviewInput = {
  rating: number;
  stayId: number;
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
      pictures: Array<{
        __typename: 'RoomPicture';
        id: number;
        roomId: number;
        url: string;
        thumbnailUrl: string;
        url1024: string | null;
        url512: string | null;
        caption: string | null;
        isPrimary: boolean;
        displayOrder: number;
      }>;
    }>;
    pictures: Array<{
      __typename: 'StayPicture';
      id: number;
      stayId: number;
      url: string;
      thumbnailUrl: string;
      url1024: string | null;
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
