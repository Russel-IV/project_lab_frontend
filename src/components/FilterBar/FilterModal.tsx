import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters } from '@/store/filtersSlice';
import { AMENITIES_LOOKUP } from '@/constants/amenities';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const dispatch = useAppDispatch();
  const activeFilters = useAppSelector((state) => state.filters);

  // Local draft states for managing modal inputs before committing initialized from the store
  const [draftPriceMin, setDraftPriceMin] = useState<number | null>(
    activeFilters.priceMin,
  );
  const [draftPriceMax, setDraftPriceMax] = useState<number | null>(
    activeFilters.priceMax,
  );
  const [draftPropertyType, setDraftPropertyType] = useState<string | null>(
    activeFilters.propertyType,
  );
  const [draftRatingMin, setDraftRatingMin] = useState<number | null>(
    activeFilters.ratingMin,
  );
  const [draftAmenityIds, setDraftAmenityIds] = useState<number[]>(
    activeFilters.amenityIds || [],
  );

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAmenity = (id: number) => {
    setDraftAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleClearAll = () => {
    setDraftPriceMin(null);
    setDraftPriceMax(null);
    setDraftPropertyType(null);
    setDraftRatingMin(null);
    setDraftAmenityIds([]);
  };

  const handleApply = () => {
    dispatch(
      setFilters({
        priceMin: draftPriceMin,
        priceMax: draftPriceMax,
        propertyType: draftPropertyType,
        ratingMin: draftRatingMin,
        amenityIds: draftAmenityIds,
      }),
    );
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content - Flex Column for Filter Sections */}
        <div className="flex flex-col gap-6 py-4 overflow-y-auto max-h-[60vh]">
          {/* Section 1: Price range */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Price range
            </h3>
            <p>Etc</p>
          </div>

          {/* Section 2: Property type */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Property type
            </h3>
            <div className="flex gap-2">
              {[
                { value: null, label: 'All stays' },
                { value: 'HOTEL', label: 'Hotel' },
                { value: 'HOME', label: 'Home' },
              ].map((opt) => {
                const isActive = draftPropertyType === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setDraftPropertyType(opt.value)}
                    className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Guest rating */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Guest rating
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: null, label: 'Any' },
                { value: 3.0, label: '3.0' },
                { value: 4.0, label: '4.0' },
                { value: 5.0, label: '5.0' },
              ].map((opt) => {
                const isActive = draftRatingMin === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setDraftRatingMin(opt.value)}
                    className={`flex-1 min-w-[70px] rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITIES_LOOKUP).map(([idStr, config]) => {
                const id = Number(idStr);
                const isActive = draftAmenityIds.includes(id);
                const Icon = config.icon;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleToggleAmenity(id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                        : 'border-border bg-card text-foreground hover:bg-muted hover:scale-[1.02]'
                    } active:scale-95`}
                  >
                    <Icon className="size-4" />
                    <span>{config.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-border pt-4 mt-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-all cursor-pointer"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
