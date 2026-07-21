import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { format, addDays } from 'date-fns';

export interface SearchState {
  place: string;
  placeRegionId: number | null;
  checkIn: string;
  checkOut: string;
  travelers: string;
}

const today = new Date();
const tomorrow = addDays(today, 1);

export const initialSearchState: SearchState = {
  place: '',
  placeRegionId: null,
  checkIn: format(today, 'yyyy-MM-dd'),
  checkOut: format(tomorrow, 'yyyy-MM-dd'),
  travelers: '1 travelers, 1 rooms',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setPlace(state, action: PayloadAction<string>) {
      state.place = action.payload;
      state.placeRegionId = null;
    },
    setPlaceSelection(
      state,
      action: PayloadAction<{ regionId: number; label: string }>,
    ) {
      state.place = action.payload.label;
      state.placeRegionId = action.payload.regionId;
    },
    setDates(
      state,
      action: PayloadAction<{ checkIn: string; checkOut: string }>,
    ) {
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
    },
    setTravelers(state, action: PayloadAction<string>) {
      state.travelers = action.payload;
    },
    setSearchQuery(
      state,
      action: PayloadAction<{
        place?: string;
        placeRegionId?: number | null;
        checkIn?: string;
        checkOut?: string;
        travelers?: string;
      }>,
    ) {
      if (action.payload.place !== undefined) {
        state.place = action.payload.place;
      }
      // Unlike the other fields, always applied when the key is present
      // (including `null`) - the URL is the source of truth on page load,
      // so the absence of ?regionId= must explicitly clear a stale value
      // rather than leaving a previous regionId dangling.
      if ('placeRegionId' in action.payload) {
        state.placeRegionId = action.payload.placeRegionId ?? null;
      }
      if (action.payload.checkIn !== undefined) {
        state.checkIn = action.payload.checkIn;
      }
      if (action.payload.checkOut !== undefined) {
        state.checkOut = action.payload.checkOut;
      }
      if (action.payload.travelers !== undefined) {
        state.travelers = action.payload.travelers;
      }
    },
  },
});

export const {
  setPlace,
  setPlaceSelection,
  setDates,
  setTravelers,
  setSearchQuery,
} = searchSlice.actions;
export default searchSlice.reducer;
