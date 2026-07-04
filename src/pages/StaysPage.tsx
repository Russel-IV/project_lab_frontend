import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  StayCardVariant,
  StayCardSkeleton,
} from '@/components/StayCardVariant';
import {
  ItemInfo,
  ItemInfoSkeleton,
  ItemInfoMessage,
} from '@/components/ItemInfo';
import { FilterBar } from '@/components/FilterBar';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery } from '@/store/searchSlice';
import { SearchForm } from '@/components/SearchForm';
import {
  getTotalGuests,
  isValidDateRange,
} from '@/components/SearchForm/searchFormUtils';
import {
  useBackgroundQuery,
  useReadQuery,
  useQuery,
  type QueryRef,
} from '@apollo/client/react';
import {
  type GetStaysQuery,
  type GetStaysQueryVariables,
  type GetStayDetailsQuery,
  type GetStayDetailsQueryVariables,
  type StayFilterInput,
} from '@/types/__generated__/graphql';
import { GET_STAYS, GET_STAY_DETAILS } from '@/graphql/stays';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Pagination } from '@/components/Pagination';

type GraphQLStay = GetStaysQuery['stays'][number];

interface StaysContentProps {
  queryRef: QueryRef<GetStaysQuery>;
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
  selectedStayId: number | null;
  setSelectedStayId: (id: number | null) => void;
}

export default function StaysPage() {
  const dispatch = useAppDispatch();

  const { place, checkIn, checkOut, travelers } = useAppSelector(
    (state) => state.search,
  );

  // Server-side search filter: destination, dates, and traveler count are
  // all wired to the backend's `stays(filter: ...)` argument, so a "Search"
  // genuinely changes which stays come back rather than just re-filtering
  // the same list.
  const filter: StayFilterInput | undefined = useMemo(() => {
    const f: StayFilterInput = {};
    if (place.trim()) f.city = place.trim();
    if (isValidDateRange(checkIn, checkOut)) {
      f.checkIn = checkIn;
      f.checkOut = checkOut;
    }
    const guests = getTotalGuests(travelers);
    if (guests > 0) f.guests = guests;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [place, checkIn, checkOut, travelers]);

  const [queryRef] = useBackgroundQuery<GetStaysQuery, GetStaysQueryVariables>(
    GET_STAYS,
    { variables: { filter } },
  );

  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);

  useEffect(() => {
    const placeParam = searchParams.get('place');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const travelersParam = searchParams.get('travelers');

    dispatch(
      setSearchQuery({
        place: placeParam ?? undefined,
        checkIn: checkInParam ?? undefined,
        checkOut: checkOutParam ?? undefined,
        travelers: travelersParam ?? undefined,
      }),
    );
  }, [searchParams, dispatch]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeDetail = () => setSelectedStayId(null);

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      {/* Stays grid: full width by default, search bar centered within it */}
      <main className="h-screen w-full overflow-hidden">
        <section className="h-full w-full max-w-6xl mx-auto overflow-y-auto flex flex-col gap-4">
          {/* Sticky search bar + filters: stack together and stay pinned to
              the top of the scrollable list, so neither ends up overlapping
              the other as the grid scrolls underneath. */}
          <div className="sticky top-0 z-40 bg-muted/20 flex flex-col gap-4 pb-2">
            <SearchForm />
            <FilterBar />
          </div>

          {/* Stays List with fine-grained Suspense boundary */}
          <ErrorBoundary FallbackComponent={StaysErrorFallback}>
            <Suspense fallback={<StayCardsGridSkeleton />}>
              <StaysListContent
                queryRef={queryRef}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                selectedStayId={selectedStayId}
                setSelectedStayId={setSelectedStayId}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>

      {/* Detail drawer: opens on top of the grid when a stay is clicked.
          Clicking the backdrop closes it; clicking a stay card underneath
          is blocked by the backdrop while the drawer is open. */}
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

// Left Panel Stays Grid Content Sub-component
function StaysListContent({
  queryRef,
  favorites,
  toggleFavorite,
  selectedStayId,
  setSelectedStayId,
}: StaysContentProps) {
  const { data } = useReadQuery(queryRef);

  const {
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    ratingMin,
    amenityIds,
  } = useAppSelector((state) => state.filters);

  const staysList: GraphQLStay[] = useMemo(() => {
    if (!data?.stays) return [];
    return data.stays.filter((stay) => {
      // 1. Price Range Filter
      const price = stay.startingFromPrice as number | null;
      if (price !== null && price !== undefined) {
        if (priceMin !== null && price < priceMin) {
          return false;
        }
        if (priceMax !== null && price > priceMax) {
          return false;
        }
      }
      // 2. Property Type Filter
      if (propertyType && stay.propertyType !== propertyType) {
        return false;
      }
      // 3. Free Cancellation Filter
      if (freeCancellation && !stay.isRefundable) {
        return false;
      }
      // 4. Guest Rating Filter
      const rating = (stay.starRating as number | null) ?? 0;
      if (ratingMin !== null) {
        if (ratingMin === 5.0) {
          if (rating < 5.0) return false;
        } else {
          if (rating < ratingMin || rating >= ratingMin + 1.0) return false;
        }
      }
      // 5. Amenities Filter
      if (amenityIds && amenityIds.length > 0) {
        const stayAmenityIds = stay.amenities?.map((a) => Number(a.id)) ?? [];
        const hasAllAmenities = amenityIds.every((id) =>
          stayAmenityIds.includes(id),
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [
    data,
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    ratingMin,
    amenityIds,
  ]);

  // Pagination state and settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Track previous filters to detect changes and reset page to 1
  const [prevFilters, setPrevFilters] = useState(() => ({
    priceMin,
    priceMax,
    propertyType,
    ratingMin,
    amenityIds,
  }));

  if (
    priceMin !== prevFilters.priceMin ||
    priceMax !== prevFilters.priceMax ||
    propertyType !== prevFilters.propertyType ||
    ratingMin !== prevFilters.ratingMin ||
    amenityIds !== prevFilters.amenityIds
  ) {
    setPrevFilters({ priceMin, priceMax, propertyType, ratingMin, amenityIds });
    setCurrentPage(1);
  }

  const totalStays = staysList.length;
  const totalPages = Math.ceil(totalStays / pageSize);

  const showPagination = totalStays > pageSize;

  // Slice list of stays for the current page
  const paginatedStays = useMemo(() => {
    if (!showPagination) return staysList;
    const startIndex = (currentPage - 1) * pageSize;
    return staysList.slice(startIndex, startIndex + pageSize);
  }, [staysList, currentPage, showPagination]);

  const activeStayId = useMemo(() => {
    if (
      selectedStayId !== null &&
      paginatedStays.some((s) => s.id === selectedStayId)
    ) {
      return selectedStayId;
    }
    return null;
  }, [paginatedStays, selectedStayId]);

  // If the selected stay drops out of view (e.g. a filter/page change), close
  // the detail drawer instead of silently swapping to a different stay.
  useEffect(() => {
    if (selectedStayId !== null && activeStayId === null) {
      setSelectedStayId(null);
    }
  }, [activeStayId, selectedStayId, setSelectedStayId]);

  const noStaysFromSearch = !data?.stays || data.stays.length === 0;

  return (
    <>
      <div className="sm:hidden">
        {/* Header Title */}
        <h1 className="text-2xl font-bold">Showing Stays in La Palma</h1>
        <p className="text-sm text-gray-600">
          Showing stays from: Jun 4 - Jun 5...
        </p>
      </div>

      {noStaysFromSearch ? (
        <StaysEmptyState message="There are no stays that fit your needs available currently. Try searching again with different requirements." />
      ) : staysList.length === 0 ? (
        <StaysEmptyState message="No stays match your search. Try adjusting your filters or destination keywords." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {paginatedStays.map((stay) => (
              <StayCardVariant
                key={stay.id}
                stay={stay}
                isLiked={!!favorites[stay.id]}
                onToggleFavorite={toggleFavorite}
                isActive={activeStayId === stay.id}
                onClick={() => setSelectedStayId(stay.id)}
              />
            ))}
          </div>
          {showPagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </>
  );
}

// Detail Drawer Content Sub-component: fetches the selected stay's full
// details independently (rather than reusing the list query's cache), so
// this panel has its own genuine loading/error/not-found states instead of
// silently reusing whatever the grid already has in memory.
function StaysDetailContent({
  selectedStayId,
  onClose,
}: {
  selectedStayId: number | null;
  onClose: () => void;
}) {
  const { data, loading, error } = useQuery<
    GetStayDetailsQuery,
    GetStayDetailsQueryVariables
  >(GET_STAY_DETAILS, {
    variables: { id: selectedStayId ?? 0 },
    skip: selectedStayId === null,
  });

  if (loading) {
    return <ItemInfoSkeleton />;
  }

  // The backend returns a GraphQL error (in addition to a null `stay`) when
  // the id doesn't exist, so a missing-stay message needs its own branch
  // rather than falling through to the generic error fallback.
  const isNotFound = error?.message.toLowerCase().includes('not found');

  if (error && !isNotFound) {
    return (
      <ItemInfoMessage
        title="Something went wrong"
        message={error.message}
        onClose={onClose}
      />
    );
  }

  if (isNotFound || !data?.stay) {
    return (
      <ItemInfoMessage
        title="Stay not found"
        message="We couldn't find the stay you're looking for. It may have been removed."
        onClose={onClose}
      />
    );
  }

  return <ItemInfo stay={data.stay} onClose={onClose} />;
}

// Single shared empty-state look for both "search returned nothing" and
// "filters narrowed the results to nothing", so only one ever shows at a
// time and they read as the same kind of message (one bold line) rather
// than two different UI patterns (a banner vs. a title+subtitle card).
function StaysEmptyState({ message }: { message: string }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-2xl bg-card">
      <p className="text-lg font-semibold text-foreground">{message}</p>
    </div>
  );
}

// Grid fallback skeleton for Stay Cards
function StayCardsGridSkeleton() {
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
        className="mt-2 w-fit bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer border-0"
      >
        Try Again
      </button>
    </div>
  );
}
