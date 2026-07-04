import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialSearchState } from './searchSlice';

export interface BookingWidgetState {
  checkIn: string;
  checkOut: string;
  travelers: string;
}

const initialState: BookingWidgetState = {
  checkIn: initialSearchState.checkIn,
  checkOut: initialSearchState.checkOut,
  travelers: initialSearchState.travelers,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDates(
      state,
      action: PayloadAction<{ checkIn: string; checkOut: string }>,
    ) {
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
    },
    setBookingTravelers(state, action: PayloadAction<string>) {
      state.travelers = action.payload;
    },
    resetBooking(state) {
      state.checkIn = initialSearchState.checkIn;
      state.checkOut = initialSearchState.checkOut;
      state.travelers = initialSearchState.travelers;
    },
  },
});

export const { setBookingDates, setBookingTravelers, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
