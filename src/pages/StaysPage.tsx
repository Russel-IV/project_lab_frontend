import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StayCardVariant } from '@/components/StayCardVariant';
import { ItemInfo } from '@/components/ItemInfo';
import { FilterBar } from '@/components/FilterBar';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery } from '@/store/searchSlice';
import SearchForm from '@/components/Form/SearchForm';
import { useQuery } from '@apollo/client/react';
import { type GetStaysQuery } from '@/types/__generated__/graphql';
import { GET_STAYS } from '@/graphql/stays';

export default function StaysPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useQuery<GetStaysQuery>(GET_STAYS);

  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Sync URL query params into Redux store on param change
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

  // Log the state whenever it changes
  useEffect(() => {
    console.log('Stays Apollo State:', { stays: data?.stays, loading, error });
  }, [data, loading, error]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Track the selected stay ID
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);

  const { propertyType, ratingMin, amenityIds } = useAppSelector(
    (state) => state.filters,
  );

  type GraphQLStay = GetStaysQuery['stays'][number];

  // Compute stays to show
  const staysList: GraphQLStay[] = useMemo(() => {
    if (loading || !data?.stays) return [];
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
  }, [data, loading, propertyType, ratingMin, amenityIds]);

  // Derive the active selected stay ID. Default to the first stay in staysList if selectedStayId isn't set or exists in staysList.
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

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      {/* Main layout container with sidebar on the left and stays list on the right */}
      <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden gap-6">
        {/* Left Panel: Stays List (Green Area) */}
        <section className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
          {/* Search Form and Header Area for Mobile 
            <div className="hidden sm:block bg-gray-200 p-4 rounded-2xl">
              <h1> Search Filter Details</h1>
            </div>
            */}

          {/* SearchFrom*/}
          <div>
            <SearchForm>
              <SearchForm.Grid>
                <SearchForm.PlaceField />
                <SearchForm.DatesField />
                <SearchForm.TravelersField />
                <SearchForm.Submit />
              </SearchForm.Grid>
            </SearchForm>
          </div>

          {/* Toggle Filters*/}
          <FilterBar />

          {data?.stays && data.stays.length > 0 && staysList.length === 0 && (
            <div className="mt-3 p-4 rounded-2xl border border-amber-200 bg-amber-50/50 text-amber-800 text-sm font-medium flex items-center gap-2">
              <span>
                No stays match the selected property type. Try changing your
                filters.
              </span>
            </div>
          )}

          <div className="sm:hidden">
            {/* Desktop Search Form Component */}
            <form className="mb-4">...</form>
            {/* Header Title */}
            <h1 className="text-2xl font-bold">Showing Stays in La Palma</h1>
            <p className="text-sm text-gray-600">
              Showing stays from: Jun 4 - Jun 5...
            </p>
          </div>

          {/* 2. Cards Grid Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-lg font-medium animate-pulse">
                Loading available stays...
              </p>
            </div>
          ) : staysList.length === 0 ? (
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
        </section>

        {/* Right Panel: Map/Details (Red Area) */}
        <aside className="hidden md:block md:w-[56%] lg:w-[47%] xl:w-[50%]  h-full">
          <ItemInfo stay={selectedStay} />
        </aside>
      </main>
    </div>
  );
}
