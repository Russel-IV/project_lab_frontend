import { configureStore } from '@reduxjs/toolkit';
import staysReducer from './staysSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    stays: staysReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
