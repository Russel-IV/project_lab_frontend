import { describe, expect, it } from 'vitest';
import bookingReducer, {
  setBookingDates,
  setBookingTravelers,
  toggleRoomSelection,
  clearRoomSelection,
  resetBooking,
  type BookingWidgetState,
} from './bookingSlice';

const selectedState: BookingWidgetState = {
  checkIn: '2026-08-10',
  checkOut: '2026-08-12',
  travelers: '2 travelers, 1 room',
  selectedRooms: [{ id: 5, name: 'Deluxe Suite', price: 250 }],
};

describe('bookingSlice', () => {
  it('toggleRoomSelection adds a room not already selected', () => {
    const state = bookingReducer(
      selectedState,
      toggleRoomSelection({ id: 7, name: 'Ocean View', price: 300 }),
    );
    expect(state.selectedRooms).toEqual([
      { id: 5, name: 'Deluxe Suite', price: 250 },
      { id: 7, name: 'Ocean View', price: 300 },
    ]);
  });

  it('toggleRoomSelection removes a room already selected', () => {
    const state = bookingReducer(
      selectedState,
      toggleRoomSelection({ id: 5, name: 'Deluxe Suite', price: 250 }),
    );
    expect(state.selectedRooms).toEqual([]);
  });

  it('clearRoomSelection empties the selected rooms', () => {
    const state = bookingReducer(selectedState, clearRoomSelection());
    expect(state.selectedRooms).toEqual([]);
  });

  it('setBookingDates clears the room selection', () => {
    const state = bookingReducer(
      selectedState,
      setBookingDates({ checkIn: '2026-09-01', checkOut: '2026-09-05' }),
    );
    expect(state.checkIn).toBe('2026-09-01');
    expect(state.checkOut).toBe('2026-09-05');
    expect(state.selectedRooms).toEqual([]);
  });

  it('setBookingTravelers clears the room selection', () => {
    const state = bookingReducer(
      selectedState,
      setBookingTravelers('4 travelers, 2 rooms'),
    );
    expect(state.travelers).toBe('4 travelers, 2 rooms');
    expect(state.selectedRooms).toEqual([]);
  });

  it('resetBooking clears the room selection along with dates/travelers', () => {
    const state = bookingReducer(selectedState, resetBooking());
    expect(state.selectedRooms).toEqual([]);
  });
});
