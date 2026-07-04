import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  priceMin: number | null;
  priceMax: number | null;
  propertyType: string | null;
  freeCancellation: boolean;
  /** Selected quality tiers (1-5 stars). Empty array means no restriction. */
  starRatings: number[];
  /** Selected bedroom counts. 4 means "4 or more". Empty array means no restriction. */
  bedrooms: number[];
  /** General/overall-property services (Wi-Fi, pool, parking, gym, etc). */
  propertyAmenityIds: number[];
  /** In-unit features (A/C, kitchen, balcony, etc). */
  roomAmenityIds: number[];
}

const initialState: FiltersState = {
  priceMin: null,
  priceMax: null,
  propertyType: null,
  freeCancellation: false,
  starRatings: [],
  bedrooms: [],
  propertyAmenityIds: [],
  roomAmenityIds: [],
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
