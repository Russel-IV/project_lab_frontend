import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  StayCardVariant,
  StayCardSkeleton,
} from '@/components/StayCardVariant';
import { ItemInfo, ItemInfoSkeleton } from '@/components/ItemInfo';
import { FilterBar } from '@/components/FilterBar';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery } from '@/store/searchSlice';
import SearchForm from '@/components/Form/SearchForm';
import {
  SearchFormMobile,
  SearchFormMobileTrigger,
} from '@/components/SearchFormMobile';
import {
  useBackgroundQuery,
  useReadQuery,
  type QueryRef,
} from '@apollo/client/react';
import { type GetStaysQuery } from '@/types/__generated__/graphql';
import { GET_STAYS } from '@/graphql/stays';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

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
  const [queryRef] = useBackgroundQuery<GetStaysQuery>(GET_STAYS);

  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      {/* Main layout container with sidebar on the left and stays list on the right */}
      <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden gap-6">
        {/* Left Panel: Stays List (Green Area) */}
        <section className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
          {/* SearchForm */}
          <div className="hidden md:block">
            <SearchForm>
              <SearchForm.Grid>
                <SearchForm.PlaceField />
                <SearchForm.DatesField />
                <SearchForm.TravelersField />
                <SearchForm.Submit />
              </SearchForm.Grid>
            </SearchForm>
          </div>

          <div className="block md:hidden">
            <SearchFormMobileTrigger
              onClick={() => setIsMobileSearchOpen(true)}
            />
            {isMobileSearchOpen && (
              <SearchFormMobile
                isOpen={isMobileSearchOpen}
                onClose={() => setIsMobileSearchOpen(false)}
              />
            )}
          </div>

          {/* Toggle Filters */}
          <FilterBar />

          {/* Stays List with fine-grained Suspense boundary */}
          <ErrorBoundary
            FallbackComponent={StaysErrorFallback}
            onError={() => setHasError(true)}
            onReset={() => setHasError(false)}
          >
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

        {/* Right Panel: Map/Details (Red Area) */}
        <aside className="hidden md:block md:w-[56%] lg:w-[47%] xl:w-[50%] h-full">
          {!hasError && (
            <ErrorBoundary FallbackComponent={StaysErrorFallback}>
              <Suspense fallback={<ItemInfoSkeleton />}>
                <StaysDetailContent
                  queryRef={queryRef}
                  selectedStayId={selectedStayId}
                  setSelectedStayId={setSelectedStayId}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </aside>
      </main>
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

  const { propertyType, ratingMin, amenityIds } = useAppSelector(
    (state) => state.filters,
  );

  const staysList: GraphQLStay[] = useMemo(() => {
    if (!data?.stays) return [];
    return data.stays.filter((stay) => {
      // 1. Property Type Filter
      if (propertyType && stay.propertyType !== propertyType) {
        return false;
      }
      // 2. Guest Rating Filter
      const rating = (stay.starRating as number | null) ?? 0;
      if (ratingMin !== null) {
        if (ratingMin === 5.0) {
          if (rating < 5.0) return false;
        } else {
          if (rating < ratingMin || rating >= ratingMin + 1.0) return false;
        }
      }
      // 3. Amenities Filter
      if (amenityIds && amenityIds.length > 0) {
        const stayAmenityIds = stay.amenities?.map((a) => Number(a.id)) ?? [];
        const hasAllAmenities = amenityIds.every((id) =>
          stayAmenityIds.includes(id),
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [data, propertyType, ratingMin, amenityIds]);

  const activeStayId = useMemo(() => {
    if (
      selectedStayId !== null &&
      staysList.some((s) => s.id === selectedStayId)
    ) {
      return selectedStayId;
    }
    return staysList.length > 0 ? staysList[0].id : null;
  }, [staysList, selectedStayId]);

  return (
    <>
      {data?.stays && data.stays.length > 0 && staysList.length === 0 && (
        <div className="mt-3 p-4 rounded-2xl border border-amber-200 bg-amber-50/50 text-amber-800 text-sm font-medium flex items-center gap-2">
          <span>
            No stays match the selected property type. Try changing your
            filters.
          </span>
        </div>
      )}

      <div className="sm:hidden">
        {/* Header Title */}
        <h1 className="text-2xl font-bold">Showing Stays in La Palma</h1>
        <p className="text-sm text-gray-600">
          Showing stays from: Jun 4 - Jun 5...
        </p>
      </div>

      {staysList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-2xl bg-card">
          <p className="text-lg font-semibold text-foreground">
            No stays match your search
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or destination keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {staysList.map((stay) => (
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
      )}
    </>
  );
}

// Right Panel Details Content Sub-component
function StaysDetailContent({
  queryRef,
  selectedStayId,
}: Omit<StaysContentProps, 'favorites' | 'toggleFavorite'>) {
  const { data } = useReadQuery(queryRef);

  const { propertyType, ratingMin, amenityIds } = useAppSelector(
    (state) => state.filters,
  );

  const staysList: GraphQLStay[] = useMemo(() => {
    if (!data?.stays) return [];
    return data.stays.filter((stay) => {
      // 1. Property Type Filter
      if (propertyType && stay.propertyType !== propertyType) {
        return false;
      }
      // 2. Guest Rating Filter
      const rating = (stay.starRating as number | null) ?? 0;
      if (ratingMin !== null) {
        if (ratingMin === 5.0) {
          if (rating < 5.0) return false;
        } else {
          if (rating < ratingMin || rating >= ratingMin + 1.0) return false;
        }
      }
      // 3. Amenities Filter
      if (amenityIds && amenityIds.length > 0) {
        const stayAmenityIds = stay.amenities?.map((a) => Number(a.id)) ?? [];
        const hasAllAmenities = amenityIds.every((id) =>
          stayAmenityIds.includes(id),
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [data, propertyType, ratingMin, amenityIds]);

  const activeStayId = useMemo(() => {
    if (
      selectedStayId !== null &&
      staysList.some((s) => s.id === selectedStayId)
    ) {
      return selectedStayId;
    }
    return staysList.length > 0 ? staysList[0].id : null;
  }, [staysList, selectedStayId]);

  const selectedStay = useMemo(() => {
    return staysList.find((s) => s.id === activeStayId) || null;
  }, [staysList, activeStayId]);

  return <ItemInfo stay={selectedStay} />;
}

// Grid fallback skeleton for Stay Cards
function StayCardsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      {Array.from({ length: 4 }).map((_, idx) => (
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
