import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import {
  getTotalGuests,
  isValidDateRange,
} from '@/components/SearchForm/searchFormUtils';
import type { StayFilterInput } from '@/types/__generated__/graphql';

type SearchContextFilter = Pick<
  StayFilterInput,
  'regionId' | 'checkIn' | 'checkOut' | 'guests'
>;

export function useSearchContextFilter(): SearchContextFilter {
  const { placeRegionId, checkIn, checkOut, travelers } = useAppSelector(
    (state) => state.search,
  );
  const [searchParams] = useSearchParams();

  const regionIdParam = searchParams.get('regionId');
  const effectiveRegionId = regionIdParam
    ? Number(regionIdParam)
    : placeRegionId;
  const effectiveCheckIn = searchParams.get('checkIn') ?? checkIn;
  const effectiveCheckOut = searchParams.get('checkOut') ?? checkOut;
  const effectiveTravelers = searchParams.get('travelers') ?? travelers;

  return useMemo(() => {
    const f: SearchContextFilter = {};
    if (effectiveRegionId != null && !Number.isNaN(effectiveRegionId)) {
      f.regionId = effectiveRegionId;
    }
    if (isValidDateRange(effectiveCheckIn, effectiveCheckOut)) {
      f.checkIn = effectiveCheckIn;
      f.checkOut = effectiveCheckOut;
    }
    const guests = getTotalGuests(effectiveTravelers);
    if (guests > 0) f.guests = guests;
    return f;
  }, [
    effectiveRegionId,
    effectiveCheckIn,
    effectiveCheckOut,
    effectiveTravelers,
  ]);
}
