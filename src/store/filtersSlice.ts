import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  priceMin: number | null;
  priceMax: number | null;
  propertyType: string | null;
  freeCancellation: boolean;
  ratingMin: number | null;
  amenityIds: number[];
}

const initialState: FiltersState = {
  priceMin: null,
  priceMax: null,
  propertyType: null,
  freeCancellation: false,
  ratingMin: null,
  amenityIds: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<FiltersState>>) {
      return { ...state, ...action.payload };
    },
    setPropertyType(state, action: PayloadAction<string | null>) {
      state.propertyType = action.payload;
    },
    toggleFreeCancellation(state) {
      state.freeCancellation = !state.freeCancellation;
    },
    clearFilters() {
      return initialState;
    },
  },
});

export const {
  setFilters,
  setPropertyType,
  toggleFreeCancellation,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
