import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/config/api';

export interface Stay {
  id: string;
  image: string;
  title: string;
  distance: string;
  hasPool: boolean;
  vipAccess: boolean;
  isAd: boolean;
  highlightTitle?: string;
  highlightDesc?: string;
  refundPolicy: string;
  reservePolicy?: string;
  rating: number;
  ratingText: string;
  reviewsCount: number;
  priceNightly: number;
  priceTotal: number;
  priceTotalRooms: number;
  originalPrice?: number;
  availabilityAlert?: string;
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
      const response = await fetch(API_ENDPOINTS.STAYS);
      if (!response.ok) {
        throw new Error('Failed to fetch stays from the API.');
      }
      const data = await response.json();
      return data as Stay[];
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
