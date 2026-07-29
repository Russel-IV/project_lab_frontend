import { lazy, Suspense, useState } from 'react';
import { ChevronDown, Map, SlidersHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleFreeCancellation,
  toggleFavoritesOnly,
} from '@/store/filtersSlice';

const FilterModal = lazy(() =>
  import('./FilterModal').then((m) => ({ default: m.FilterModal })),
);

const StaysMapModal = lazy(() =>
  import('@/components/StaysMapModal').then((m) => ({
    default: m.StaysMapModal,
  })),
);

interface FilterBarProps {
  onSelectStay: (stayId: number) => void;
}

export function FilterBar({ onSelectStay }: FilterBarProps) {
  const dispatch = useAppDispatch();
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
  const user = useAppSelector((state) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const isFiltersActive =
    priceMin !== null ||
    priceMax !== null ||
    propertyType !== null ||
    starRatings.length > 0 ||
    bedrooms.length > 0 ||
    propertyAmenityIds.length > 0 ||
    roomAmenityIds.length > 0;
  const isPropertyTypeActive = propertyType !== null;
  const activeFiltersCount = [
    priceMin !== null || priceMax !== null,
    propertyType !== null,
    starRatings.length > 0,
    bedrooms.length > 0,
    propertyAmenityIds.length > 0,
    roomAmenityIds.length > 0,
  ].filter(Boolean).length;

  const baseButtonClass =
    'inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border px-4 py-2 text-xs md:text-sm font-medium shadow-2xs active:scale-[0.98] transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-frui-orange';

  const getButtonClass = (isActive: boolean) =>
    isActive
      ? `${baseButtonClass} border-frui-orange bg-frui-orange/10 text-frui-orange hover:bg-frui-orange/20`
      : `${baseButtonClass} border-border bg-card text-foreground hover:bg-muted hover:border-muted-foreground/30`;

  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto border-b border-border py-3 px-2 scrollbar-none select-none">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={getButtonClass(isFiltersActive)}
      >
        <SlidersHorizontal className="size-3.5" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex size-4.5 items-center justify-center rounded-full bg-frui-orange text-[10px] font-bold text-frui-white">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={getButtonClass(isPropertyTypeActive)}
      >
        <span>
          {propertyType !== null
            ? `Property: ${propertyType === 'HOME' ? 'Home' : 'Hotel'}`
            : 'Property type'}
        </span>
        <ChevronDown className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => dispatch(toggleFreeCancellation())}
        className={getButtonClass(freeCancellation)}
      >
        <span>Free cancellation</span>
      </button>

      {user && (
        <button
          type="button"
          onClick={() => dispatch(toggleFavoritesOnly())}
          className={getButtonClass(favoritesOnly)}
        >
          <span>Favorites only</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className={getButtonClass(false)}
      >
        <Map className="size-3.5" />
        <span>Map</span>
      </button>

      {isModalOpen && (
        <Suspense fallback={null}>
          <FilterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}

      {isMapOpen && (
        <Suspense fallback={null}>
          <StaysMapModal
            onClose={() => setIsMapOpen(false)}
            onSelectStay={onSelectStay}
          />
        </Suspense>
      )}
    </div>
  );
}
