import { useState, useMemo, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useReadQuery, type QueryRef } from '@apollo/client/react';
import type { GetStaysQuery } from '@/types/__generated__/graphql';
import { StayCardVariant } from '@/components/StayCardVariant';
import { Pagination } from '@/components/Pagination';
// Single shared empty-state look for both "search returned nothing" and
// "filters narrowed the results to nothing", so only one ever shows at a
// time and they read as the same kind of message (one bold line) rather
// than two different UI patterns (a banner vs. a title+subtitle card).
export function StaysEmptyState({ message }: { message: string }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-2xl bg-card">
      <p className="text-lg font-semibold text-foreground">{message}</p>
    </div>
  );
}

type GraphQLStay = GetStaysQuery['stays'][number];

interface StaysContentProps {
  queryRef: QueryRef<GetStaysQuery>;
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
  selectedStayId: number | null;
  setSelectedStayId: (id: number | null) => void;
}

export function StaysListContent({
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
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
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
      // 4. Quality Tier Filter (1-5 stars, multi-select) - a stay matches if
      // its starRating rounds to any one of the selected tiers.
      if (starRatings.length > 0) {
        const rating = stay.starRating as number | null;
        const tier = rating !== null ? Math.round(rating) : null;
        if (tier === null || !starRatings.includes(tier)) return false;
      }
      // 5. Capacity Filter (bedroom count, multi-select) - a stay matches if
      // any of its rooms has one of the selected bedroom counts; 4 means "4
      // or more".
      if (bedrooms.length > 0) {
        const stayRooms = stay.rooms ?? [];
        const hasMatchingRoom = stayRooms.some((room) =>
          bedrooms.some((bucket) =>
            bucket >= 4
              ? room.bedroomAmount >= 4
              : room.bedroomAmount === bucket,
          ),
        );
        if (!hasMatchingRoom) return false;
      }
      // 6. Property Amenities Filter (general services) - must offer ALL
      // selected amenities.
      if (propertyAmenityIds.length > 0) {
        const stayAmenityIds = stay.amenities?.map((a) => Number(a.id)) ?? [];
        const hasAll = propertyAmenityIds.every((id) =>
          stayAmenityIds.includes(id),
        );
        if (!hasAll) return false;
      }
      // 7. Room Amenities Filter (in-unit features) - must offer ALL
      // selected amenities.
      if (roomAmenityIds.length > 0) {
        const stayAmenityIds = stay.amenities?.map((a) => Number(a.id)) ?? [];
        const hasAll = roomAmenityIds.every((id) =>
          stayAmenityIds.includes(id),
        );
        if (!hasAll) return false;
      }
      return true;
    });
  }, [
    data,
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
  ]);

  // Pagination state and settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Track previous filters to detect changes and reset page to 1
  const [prevFilters, setPrevFilters] = useState(() => ({
    priceMin,
    priceMax,
    propertyType,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
  }));

  if (
    priceMin !== prevFilters.priceMin ||
    priceMax !== prevFilters.priceMax ||
    propertyType !== prevFilters.propertyType ||
    starRatings !== prevFilters.starRatings ||
    bedrooms !== prevFilters.bedrooms ||
    propertyAmenityIds !== prevFilters.propertyAmenityIds ||
    roomAmenityIds !== prevFilters.roomAmenityIds
  ) {
    setPrevFilters({
      priceMin,
      priceMax,
      propertyType,
      starRatings,
      bedrooms,
      propertyAmenityIds,
      roomAmenityIds,
    });
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
        <StaysEmptyState message="No stays match your filters. Try removing some filters to see more results." />
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
