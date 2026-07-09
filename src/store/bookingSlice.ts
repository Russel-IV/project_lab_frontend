import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialSearchState } from './searchSlice';

export interface SelectedRoom {
  id: number;
  name: string;
  price: number;
}

export interface BookingWidgetState {
  checkIn: string;
  checkOut: string;
  travelers: string;
  selectedRooms: SelectedRoom[];
}

const initialState: BookingWidgetState = {
  checkIn: initialSearchState.checkIn,
  checkOut: initialSearchState.checkOut,
  travelers: initialSearchState.travelers,
  selectedRooms: [],
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
      state.selectedRooms = [];
    },
    setBookingTravelers(state, action: PayloadAction<string>) {
      state.travelers = action.payload;
      state.selectedRooms = [];
    },
    toggleRoomSelection(state, action: PayloadAction<SelectedRoom>) {
      const index = state.selectedRooms.findIndex(
        (room) => room.id === action.payload.id,
      );
      if (index >= 0) {
        state.selectedRooms.splice(index, 1);
      } else {
        state.selectedRooms.push(action.payload);
      }
    },
    clearRoomSelection(state) {
      state.selectedRooms = [];
    },
    resetBooking(state) {
      state.checkIn = initialSearchState.checkIn;
      state.checkOut = initialSearchState.checkOut;
      state.travelers = initialSearchState.travelers;
      state.selectedRooms = [];
    },
  },
});

export const {
  setBookingDates,
  setBookingTravelers,
  toggleRoomSelection,
  clearRoomSelection,
  resetBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
