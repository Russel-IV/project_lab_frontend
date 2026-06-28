import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@apollo/client/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters } from '@/store/filtersSlice';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { GET_STAYS } from '@/graphql/stays';
import { type GetStaysQuery } from '@/types/__generated__/graphql';
import { Slider } from '@/components/ui/slider';

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

  // Retrieve stay items dynamically from Apollo Client cache (populated by StaysPage)
  const { data } = useQuery<GetStaysQuery>(GET_STAYS, {
    fetchPolicy: 'cache-first',
  });

  const stays = data?.stays || [];
  const prices = stays
    .map((s) => s.startingFromPrice as number | null)
    .filter((p: unknown): p is number => typeof p === 'number');

  // Compute pricing bounds and details
  const globalMin = prices.length > 0 ? Math.min(...prices) : 0;
  const globalMax = prices.length > 0 ? Math.max(...prices) : 1000;
  const isUSD = globalMin < 10000;

  // Determine dynamic histogram bin ranges
  const numBins = 40;
  const binWidth = (globalMax - globalMin) / numBins;

  const bins = Array.from({ length: numBins }, () => 0);
  prices.forEach((price: number) => {
    const binIndex = Math.min(
      Math.floor((price - globalMin) / (binWidth || 1)),
      numBins - 1,
    );
    if (binIndex >= 0 && binIndex < numBins) {
      bins[binIndex]++;
    }
  });

  const maxCount = Math.max(...bins, 1);

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
        className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl border border-frui-blue/10 bg-frui-cream p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-frui-blue/10 pb-4 mb-4">
          <h2 className="text-lg font-bold text-frui-blue">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-frui-blue/60 hover:bg-frui-blue/10 hover:text-frui-blue transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-frui-orange"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content - Flex Column for Filter Sections */}
        <div className="flex flex-col gap-6 py-4 overflow-y-auto max-h-[60vh]">
          {/* Section 1: Price range */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-frui-blue">Price range</h3>

            {/* Histogram and Slider Container */}
            <div className="flex flex-col gap-2 px-3 text-left">
              {/* Histogram */}
              <div className="flex items-end gap-[2px] h-16 w-full select-none">
                {bins.map((count, i) => {
                  const binMin = globalMin + i * binWidth;
                  const binMax = binMin + binWidth;
                  const currentMin = draftPriceMin ?? globalMin;
                  const currentMax = draftPriceMax ?? globalMax;
                  const isSelected =
                    binMin >= currentMin && binMax <= currentMax;
                  const heightPercent = (count / maxCount) * 100;
                  return (
                    <div
                      key={i}
                      className={`flex-1 transition-colors duration-200 rounded-xs ${
                        isSelected ? 'bg-frui-orange' : 'bg-frui-blue/10'
                      }`}
                      style={{ height: `${Math.max(6, heightPercent)}%` }}
                    />
                  );
                })}
              </div>

              <Slider
                min={globalMin}
                max={globalMax}
                value={[draftPriceMin ?? globalMin, draftPriceMax ?? globalMax]}
                onValueChange={(vals) => {
                  if (Array.isArray(vals)) {
                    setDraftPriceMin(vals[0]);
                    setDraftPriceMax(vals[1]);
                  }
                }}
                className="w-full"
              />
            </div>

            {/* Inputs Row */}
            <div className="flex items-center gap-4 justify-between mt-2">
              <div className="flex-1 flex flex-col gap-1 text-left">
                <span className="text-xs text-frui-blue/60 font-medium pl-1">
                  Minimum
                </span>
                <div className="relative flex items-center rounded-full border border-frui-blue/20 bg-frui-white px-4 py-2.5 shadow-2xs focus-within:border-frui-orange focus-within:ring-2 focus-within:ring-frui-orange/20">
                  <span className="text-sm font-semibold text-frui-blue/60 mr-1">
                    {isUSD ? '$' : 'CLP '}
                  </span>
                  <input
                    type="number"
                    value={draftPriceMin ?? ''}
                    placeholder={String(globalMin)}
                    className="w-full bg-transparent text-sm font-bold text-frui-blue focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onChange={(e) => {
                      const val =
                        e.target.value === '' ? null : Number(e.target.value);
                      setDraftPriceMin(val);
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1 text-left">
                <span className="text-xs text-frui-blue/60 font-medium pl-1">
                  Maximum
                </span>
                <div className="relative flex items-center rounded-full border border-frui-blue/20 bg-frui-white px-4 py-2.5 shadow-2xs focus-within:border-frui-orange focus-within:ring-2 focus-within:ring-frui-orange/20">
                  <span className="text-sm font-semibold text-frui-blue/60 mr-1">
                    {isUSD ? '$' : 'CLP '}
                  </span>
                  <input
                    type="number"
                    value={draftPriceMax ?? ''}
                    placeholder={String(globalMax)}
                    className="w-full bg-transparent text-sm font-bold text-frui-blue focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onChange={(e) => {
                      const val =
                        e.target.value === '' ? null : Number(e.target.value);
                      setDraftPriceMax(val);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Property type */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-frui-blue">Property type</h3>
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
                        ? 'border-frui-blue bg-frui-blue text-frui-white shadow-sm'
                        : 'border-frui-blue/20 bg-frui-white text-frui-blue hover:bg-frui-cream'
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
            <h3 className="text-sm font-bold text-frui-blue">Guest rating</h3>
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
                        ? 'border-frui-blue bg-frui-blue text-frui-white shadow-sm'
                        : 'border-frui-blue/20 bg-frui-white text-frui-blue hover:bg-frui-cream'
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
            <h3 className="text-sm font-bold text-frui-blue">Amenities</h3>
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
                        ? 'border-frui-blue bg-frui-blue text-frui-white shadow-sm scale-[1.02]'
                        : 'border-frui-blue/20 bg-frui-white text-frui-blue hover:bg-frui-cream hover:scale-[1.02]'
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
        <div className="flex justify-between border-t border-frui-blue/10 pt-4 mt-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-xl border border-frui-blue/20 bg-transparent px-4 py-2 text-sm font-semibold text-frui-blue hover:bg-frui-blue/10 transition-all cursor-pointer"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-frui-blue px-4 py-2 text-sm font-semibold text-frui-white shadow-sm hover:bg-frui-blue/90 active:scale-95 transition-all cursor-pointer"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
