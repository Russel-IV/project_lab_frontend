import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import filtersReducer from './filtersSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filters: filtersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
