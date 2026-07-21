import { lazy, Suspense, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFreeCancellation } from '@/store/filtersSlice';

const FilterModal = lazy(() =>
  import('./FilterModal').then((m) => ({ default: m.FilterModal })),
);

export function FilterBar() {
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
  } = useAppSelector((state) => state.filters);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFiltersActive =
    priceMin !== null ||
    priceMax !== null ||
    propertyType !== null ||
    starRatings.length > 0 ||
    bedrooms.length > 0 ||
    propertyAmenityIds.length > 0 ||
    roomAmenityIds.length > 0;
  const isPropertyTypeActive = propertyType !== null;

  // Active count for filters button badge
  const activeFiltersCount = [
    priceMin !== null || priceMax !== null,
    propertyType !== null,
    starRatings.length > 0,
    bedrooms.length > 0,
    propertyAmenityIds.length > 0,
    roomAmenityIds.length > 0,
  ].filter(Boolean).length;

  const baseButtonClass =
    'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs md:text-sm font-medium shadow-2xs active:scale-[0.98] transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-frui-orange';

  const getButtonClass = (isActive: boolean) =>
    isActive
      ? `${baseButtonClass} border-frui-orange bg-frui-orange/10 text-frui-orange hover:bg-frui-orange/20`
      : `${baseButtonClass} border-border bg-card text-foreground hover:bg-muted hover:border-muted-foreground/30`;

  return (
    <div className="flex w-full items-center gap-2 border-b border-border bg-background/50 backdrop-blur-xs py-3 px-2">
      {/* Dropdown Filter: Price */}
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

      {/* Dropdown Filter: Property Type */}
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

      {/* Toggle Filter: Free Cancellation */}
      <button
        type="button"
        onClick={() => dispatch(toggleFreeCancellation())}
        className={getButtonClass(freeCancellation)}
      >
        <span>Free cancellation</span>
      </button>

      {isModalOpen && (
        <Suspense fallback={null}>
          <FilterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
