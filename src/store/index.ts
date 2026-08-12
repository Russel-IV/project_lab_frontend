import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import filtersReducer from './filtersSlice';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import paymentReducer from './paymentSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filters: filtersReducer,
    auth: authReducer,
    booking: bookingReducer,
    payment: paymentReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
