import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { StayFilterInput } from '@/types/__generated__/graphql';
import { useSearchContextFilter } from './useSearchContextFilter';

// Merges search-context fields (regionId/dates/guests) with FilterBar's
// fields into the single filter object GET_STAYS expects — shared so every
// GET_STAYS caller (the list itself, the "view all stays" map) filters
// identically.
export function useStaysFilter(): StayFilterInput | undefined {
  const searchContextFilter = useSearchContextFilter();
  const {
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
    favoritesOnly,
  } = useAppSelector((state) => state.filters);

  return useMemo(() => {
    const f: StayFilterInput = { ...searchContextFilter };
    if (priceMin !== null) f.minPricePerNight = priceMin;
    if (priceMax !== null) f.maxPricePerNight = priceMax;
    if (propertyType)
      f.propertyType = propertyType as StayFilterInput['propertyType'];
    if (freeCancellation) f.isRefundable = true;
    if (starRatings.length > 0) f.starRatings = starRatings;
    if (bedrooms.length > 0) f.bedrooms = bedrooms;
    if (propertyAmenityIds.length > 0)
      f.propertyAmenityIds = propertyAmenityIds;
    if (roomAmenityIds.length > 0) f.roomAmenityIds = roomAmenityIds;
    if (favoritesOnly) f.favoritesOnly = true;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [
    searchContextFilter,
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
    favoritesOnly,
  ]);
}
