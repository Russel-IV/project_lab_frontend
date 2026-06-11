import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { format, addDays } from 'date-fns';

export interface SearchState {
  place: string;
  checkIn: string;
  checkOut: string;
  travelers: string;
}

const today = new Date();
const tomorrow = addDays(today, 1);

const initialState: SearchState = {
  place: '',
  checkIn: format(today, 'yyyy-MM-dd'),
  checkOut: format(tomorrow, 'yyyy-MM-dd'),
  travelers: '1 travelers, 1 rooms',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPlace(state, action: PayloadAction<string>) {
      state.place = action.payload;
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
        checkIn?: string;
        checkOut?: string;
        travelers?: string;
      }>,
    ) {
      if (action.payload.place !== undefined) {
        state.place = action.payload.place;
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

export const { setPlace, setDates, setTravelers, setSearchQuery } =
  searchSlice.actions;
export default searchSlice.reducer;
