import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery } from '@/store/searchSlice';
import { SearchForm } from '@/components/SearchForm';
import { FilterBar } from '@/components/FilterBar';
import {
  getTotalGuests,
  isValidDateRange,
} from '@/components/SearchForm/searchFormUtils';
import type { StayFilterInput } from '@/types/__generated__/graphql';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { StayCardSkeleton } from '@/components/StayCardVariant';
import { Seo } from '@/lib/seo';
import { Sections, MobileSections } from '@/components/Sections';
import { useFavorites } from '@/hooks/useFavorites';

import { StaysListContent } from './StaysListContent';
import { StaysDetailContent } from './StaysDetailContent';

const SCROLL_TOP_THRESHOLD = 400;

export default function StaysPage() {
  const dispatch = useAppDispatch();

  const { place, placeRegionId, checkIn, checkOut, travelers } = useAppSelector(
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

  const {
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
  } = useAppSelector((state) => state.filters);

  // Location filtering is regionId-only (city/countryCode text matching was
  // removed from the schema per ADR-0018, which favors a resolved
  // destination id over free-text matching) - if the user hasn't selected a
  // suggestion yet (no regionId resolved), no location filter is applied,
  // same as when the field is empty. All filtering (search fields and
  // FilterBar fields alike) is applied server-side, so infinite-scroll pages
  // stay correct past the first page.
  const filter: StayFilterInput | undefined = useMemo(() => {
    const f: StayFilterInput = {};
    if (effectiveRegionId != null && !Number.isNaN(effectiveRegionId)) {
      f.regionId = effectiveRegionId;
    }
    if (isValidDateRange(effectiveCheckIn, effectiveCheckOut)) {
      f.checkIn = effectiveCheckIn;
      f.checkOut = effectiveCheckOut;
    }
    const guests = getTotalGuests(effectiveTravelers);
    if (guests > 0) f.guests = guests;
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
    return Object.keys(f).length > 0 ? f : undefined;
  }, [
    effectiveRegionId,
    effectiveCheckIn,
    effectiveCheckOut,
    effectiveTravelers,
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
  ]);

  const { favorites, toggleFavorite } = useFavorites();
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const placeParam = searchParams.get('place');
    const regionIdUrlParam = searchParams.get('regionId');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const travelersParam = searchParams.get('travelers');

    dispatch(
      setSearchQuery({
        place: placeParam ?? undefined,
        placeRegionId: regionIdUrlParam ? Number(regionIdUrlParam) : null,
        checkIn: checkInParam ?? undefined,
        checkOut: checkOutParam ?? undefined,
        travelers: travelersParam ?? undefined,
      }),
    );
  }, [searchParams, dispatch]);

  const closeDetail = () => setSelectedStayId(null);

  const trimmedPlace = place.trim();

  return (
    <div className="flex-1 bg-frui-cream py-10 px-4 sm:px-6 lg:px-8">
      <Seo
        title={trimmedPlace ? `Stays in ${trimmedPlace}` : 'Search Stays'}
        description={
          trimmedPlace
            ? `Browse and book stays in ${trimmedPlace}. Compare prices, amenities, and reviews on Frui.`
            : 'Browse and book stays worldwide. Compare prices, amenities, and reviews on Frui.'
        }
        path="/stays"
      />

      <div className="w-full md:hidden">
        <MobileSections />
      </div>

      {/* Negative margins cancel the tabs' and search form's own top
          margins for exact 16px/8px gaps. */}
      <div className="hidden md:block w-full max-w-6xl mx-auto -mt-10 -mb-6">
        <Sections />
      </div>

      <main className="w-full">
        <section className="w-full max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col gap-4 pb-2">
            <SearchForm />
            <FilterBar />
          </div>

          <ErrorBoundary FallbackComponent={StaysErrorFallback}>
            <Suspense fallback={<StayCardsGridSkeleton />}>
              <StaysListContent
                filter={filter}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                selectedStayId={selectedStayId}
                setSelectedStayId={setSelectedStayId}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed left-4 bottom-6 md:left-8 z-40 flex size-11 items-center justify-center rounded-full bg-frui-orange text-frui-white shadow-lg transition-all hover:bg-[#cf5505] active:scale-95 cursor-pointer border-0"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {selectedStayId !== null && (
        <>
          <div
            className="fixed inset-0 bg-frui-blue/40 z-40"
            onClick={closeDetail}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[56%] lg:w-[47%] xl:w-[50%] p-4 md:p-6">
            <StaysDetailContent
              selectedStayId={selectedStayId}
              onClose={closeDetail}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Grid fallback skeleton for Stay Cards
export function StayCardsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <StayCardSkeleton key={idx} />
      ))}
    </div>
  );
}

function StaysErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error || 'An unexpected error occurred.');

  return (
    <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium flex flex-col gap-2">
      <h3 className="font-semibold text-base text-foreground">
        Something went wrong
      </h3>
      <p className="text-muted-foreground">{errorMessage}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 w-fit bg-frui-orange text-frui-white hover:brightness-95 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer border-0"
      >
        Try Again
      </button>
    </div>
  );
}
