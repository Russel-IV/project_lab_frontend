import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
