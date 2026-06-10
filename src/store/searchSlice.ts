import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  place: string;
  dates: string;
  travelers: string;
}

const initialState: SearchState = {
  place: '',
  dates: 'Thu, Jun 25 - Sun, Jun 28',
  travelers: '6 travelers, 2 rooms',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPlace(state, action: PayloadAction<string>) {
      state.place = action.payload;
    },
    setDates(state, action: PayloadAction<string>) {
      state.dates = action.payload;
    },
    setTravelers(state, action: PayloadAction<string>) {
      state.travelers = action.payload;
    },
    setSearchQuery(
      state,
      action: PayloadAction<{
        place?: string;
        dates?: string;
        travelers?: string;
      }>,
    ) {
      if (action.payload.place !== undefined) {
        state.place = action.payload.place;
      }
      if (action.payload.dates !== undefined) {
        state.dates = action.payload.dates;
      }
      if (action.payload.travelers !== undefined) {
        state.travelers = action.payload.travelers;
      }
    },
  },
});

export const { setPlace, setDates, setTravelers, setSearchQuery } =
  searchSlice.actions;
export default searchSlice.reducer;
