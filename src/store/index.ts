import { configureStore } from '@reduxjs/toolkit';
import staysReducer from './staysSlice';

export const store = configureStore({
  reducer: {
    stays: staysReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
