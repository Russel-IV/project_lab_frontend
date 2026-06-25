import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { FilterModal } from './FilterModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFreeCancellation } from '@/store/filtersSlice';

export function FilterBar() {
  const dispatch = useAppDispatch();
  const {
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    ratingMin,
    amenityIds,
  } = useAppSelector((state) => state.filters);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFiltersActive =
    priceMin !== null ||
    priceMax !== null ||
    propertyType !== null ||
    ratingMin !== null ||
    (amenityIds && amenityIds.length > 0);
  const isPropertyTypeActive = propertyType !== null;

  // Active count for filters button badge
  const activeFiltersCount = [
    priceMin !== null || priceMax !== null,
    propertyType !== null,
    ratingMin !== null,
    amenityIds && amenityIds.length > 0,
  ].filter(Boolean).length;

  const baseButtonClass =
    'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs md:text-sm font-medium shadow-2xs active:scale-[0.98] transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary';

  const getButtonClass = (isActive: boolean) =>
    isActive
      ? `${baseButtonClass} border-primary bg-primary/10 text-primary hover:bg-primary/20`
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
          <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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
        <FilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
