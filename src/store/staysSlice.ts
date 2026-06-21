import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/config/api';
import {
  type StayDto,
  type AddressResponse,
  type RoomResponse,
  type StayPictureResponse,
} from '@/dtos/stayDTO';

export type Stay = StayDto;

interface GraphQLId {
  id: number;
}

interface GraphQLStay {
  id: number;
  name: string;
  about: string | null;
  propertyType: 'HOTEL' | 'HOME';
  isRefundable: boolean;
  starRating: number | null;
  daysFromBookingCancellationDeadline: number | null;
  policiesText: string | null;
  importantInformation: string | null;
  startingFromPrice: number | null;
  address: AddressResponse;
  rooms: RoomResponse[];
  pictures: StayPictureResponse[];
  host: GraphQLId | null;
  propertyBrand: GraphQLId | null;
  amenities: GraphQLId[] | null;
  views: GraphQLId[] | null;
  accessibilities: GraphQLId[] | null;
  mealPlans: GraphQLId[] | null;
  paymentTypes: GraphQLId[] | null;
  travelerExperiences: GraphQLId[] | null;
}

interface StaysState {
  data: Stay[];
  loading: boolean;
  error: string | null;
}

const initialState: StaysState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk for fetching data
export const fetchStays = createAsyncThunk(
  'stays/fetchStays',
  async (_, { rejectWithValue }) => {
    try {
      const query = `
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

      const response = await fetch(API_ENDPOINTS.GRAPHQL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stays from the GraphQL API.');
      }

      const json = await response.json();
      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'GraphQL error');
      }

      const stays = json.data.stays || [];

      // Map the GraphQL Stay type back to the expected StayDto structure
      const mappedData: Stay[] = stays.map((stay: GraphQLStay) => ({
        id: stay.id,
        name: stay.name,
        about: stay.about,
        propertyType: stay.propertyType,
        address: stay.address,
        isRefundable: stay.isRefundable,
        starRating: stay.starRating,
        daysFromBookingCancellationDeadline:
          stay.daysFromBookingCancellationDeadline,
        policiesText: stay.policiesText,
        importantInformation: stay.importantInformation,
        hostId: stay.host?.id ?? 0,
        propertyBrandId: stay.propertyBrand?.id ?? null,
        viewIds: stay.views?.map((v) => v.id) ?? [],
        amenityIds: stay.amenities?.map((a) => a.id) ?? [],
        accessibilityIds: stay.accessibilities?.map((a) => a.id) ?? [],
        mealPlanIds: stay.mealPlans?.map((m) => m.id) ?? [],
        paymentTypeIds: stay.paymentTypes?.map((p) => p.id) ?? [],
        travelerExperienceIds: stay.travelerExperiences?.map((t) => t.id) ?? [],
        rooms: stay.rooms ?? [],
        pictures: stay.pictures ?? [],
        startingFromPrice: stay.startingFromPrice,
      }));

      return mappedData;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching stays.';
      return rejectWithValue(errorMessage);
    }
  },
);

const staysSlice = createSlice({
  name: 'stays',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStays.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStays.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch stays';
      });
  },
});

export default staysSlice.reducer;
