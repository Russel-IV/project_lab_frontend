import { X, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@apollo/client/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters } from '@/store/filtersSlice';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { GET_STAY_PRICE_STATS } from '@/graphql/stays';
import {
  type GetStayPriceStatsQuery,
  type GetStayPriceStatsQueryVariables,
  type StayFilterInput,
} from '@/types/__generated__/graphql';
import { Slider } from '@/components/ui/slider';
import { useSearchContextFilter } from '@/hooks/useSearchContextFilter';

const NUM_BINS = 40;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const dispatch = useAppDispatch();
  const activeFilters = useAppSelector((state) => state.filters);

  const [draftPriceMin, setDraftPriceMin] = useState<number | null>(
    activeFilters.priceMin,
  );
  const [draftPriceMax, setDraftPriceMax] = useState<number | null>(
    activeFilters.priceMax,
  );
  const [draftPropertyType, setDraftPropertyType] = useState<string | null>(
    activeFilters.propertyType,
  );
  const [draftStarRatings, setDraftStarRatings] = useState<number[]>(
    activeFilters.starRatings,
  );
  const [draftBedrooms, setDraftBedrooms] = useState<number[]>(
    activeFilters.bedrooms,
  );
  const [draftPropertyAmenityIds, setDraftPropertyAmenityIds] = useState<
    number[]
  >(activeFilters.propertyAmenityIds);
  const [draftRoomAmenityIds, setDraftRoomAmenityIds] = useState<number[]>(
    activeFilters.roomAmenityIds,
  );

  const searchContextFilter = useSearchContextFilter();

  // Excludes price so the histogram always shows the full distribution for
  // the current region/dates/other filters — narrowing the price slider
  // would otherwise shrink the bars it's drawn against on every drag. Uses
  // the in-progress draft values (not activeFilters) so toggling e.g.
  // property type live-updates the histogram before the user hits Apply.
  const statsFilter: StayFilterInput | undefined = useMemo(() => {
    const f: StayFilterInput = { ...searchContextFilter };
    if (draftPropertyType)
      f.propertyType = draftPropertyType as StayFilterInput['propertyType'];
    if (activeFilters.freeCancellation) f.isRefundable = true;
    if (draftStarRatings.length > 0) f.starRatings = draftStarRatings;
    if (draftBedrooms.length > 0) f.bedrooms = draftBedrooms;
    if (draftPropertyAmenityIds.length > 0)
      f.propertyAmenityIds = draftPropertyAmenityIds;
    if (draftRoomAmenityIds.length > 0) f.roomAmenityIds = draftRoomAmenityIds;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [
    searchContextFilter,
    draftPropertyType,
    activeFilters.freeCancellation,
    draftStarRatings,
    draftBedrooms,
    draftPropertyAmenityIds,
    draftRoomAmenityIds,
  ]);

  const { data } = useQuery<
    GetStayPriceStatsQuery,
    GetStayPriceStatsQueryVariables
  >(GET_STAY_PRICE_STATS, {
    variables: { filter: statsFilter, bins: NUM_BINS },
  });

  const stats = data?.stayPriceStats;
  const globalMin = stats?.min ?? 0;
  const globalMax = stats?.max ?? 1000;
  const isUSD = globalMin < 10000;

  const binWidth = (globalMax - globalMin) / NUM_BINS;
  const bins = stats?.histogram ?? Array.from({ length: NUM_BINS }, () => 0);
  const maxCount = Math.max(...bins, 1);

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

  const toggleInArray = (list: number[], value: number) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const handleToggleStarRating = (tier: number) => {
    setDraftStarRatings((prev) => toggleInArray(prev, tier));
  };

  const handleToggleBedroom = (bucket: number) => {
    setDraftBedrooms((prev) => toggleInArray(prev, bucket));
  };

  const handleTogglePropertyAmenity = (id: number) => {
    setDraftPropertyAmenityIds((prev) => toggleInArray(prev, id));
  };

  const handleToggleRoomAmenity = (id: number) => {
    setDraftRoomAmenityIds((prev) => toggleInArray(prev, id));
  };

  const handleSelectPropertyType = (value: string | null) => {
    if (value === null || draftPropertyType === null) {
      setDraftPropertyType(value);
    } else {
      setDraftPropertyType(null);
    }
  };

  const handleClearAll = () => {
    setDraftPriceMin(null);
    setDraftPriceMax(null);
    setDraftPropertyType(null);
    setDraftStarRatings([]);
    setDraftBedrooms([]);
    setDraftPropertyAmenityIds([]);
    setDraftRoomAmenityIds([]);
  };

  const handleApply = () => {
    const shouldSwap =
      draftPriceMin !== null &&
      draftPriceMax !== null &&
      draftPriceMin > draftPriceMax;

    dispatch(
      setFilters({
        priceMin: shouldSwap ? draftPriceMax : draftPriceMin,
        priceMax: shouldSwap ? draftPriceMin : draftPriceMax,
        propertyType: draftPropertyType,
        starRatings: draftStarRatings,
        bedrooms: draftBedrooms,
        propertyAmenityIds: draftPropertyAmenityIds,
        roomAmenityIds: draftRoomAmenityIds,
      }),
    );
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl border border-frui-blue/10 bg-frui-cream p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
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

        <div className="flex flex-col gap-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-frui-blue">Price range</h3>

            <div className="flex flex-col gap-2 px-3 text-left">
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
                    id="price-min"
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
                    id="price-max"
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
                    onClick={() => handleSelectPropertyType(opt.value)}
                    className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border-frui-orange bg-frui-orange text-frui-white shadow-sm'
                        : 'border-frui-blue/20 bg-frui-white text-frui-blue hover:bg-frui-cream'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-frui-blue">Quality tier</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((tier) => {
                const isActive = draftStarRatings.includes(tier);
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => handleToggleStarRating(tier)}
                    className={`flex-1 min-w-[56px] flex items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border-frui-orange bg-frui-orange text-frui-white shadow-sm'
                        : 'border-frui-blue/20 bg-frui-white text-frui-blue hover:bg-frui-cream'
                    }`}
                  >
                    {tier}
                    <Star
                      className={`size-3 ${isActive ? 'fill-frui-white' : 'fill-frui-blue/40'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-frui-blue">Bedrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4+' },
              ].map((opt) => {
                const isActive = draftBedrooms.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleToggleBedroom(opt.value)}
                    className={`flex-1 min-w-[56px] rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border-frui-orange bg-frui-orange text-frui-white shadow-sm'
                        : 'border-frui-blue/20 bg-frui-white text-frui-blue hover:bg-frui-cream'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-frui-blue">
              Property Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITIES_LOOKUP)
                .filter(([, config]) => config.type === 'PROPERTY_AMENITY')
                .map(([idStr, config]) => {
                  const id = Number(idStr);
                  const isActive = draftPropertyAmenityIds.includes(id);
                  const Icon = config.icon;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleTogglePropertyAmenity(id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-frui-orange bg-frui-orange text-frui-white shadow-sm scale-[1.02]'
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

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-frui-blue">Room Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITIES_LOOKUP)
                .filter(([, config]) => config.type === 'ROOM_AMENITY')
                .map(([idStr, config]) => {
                  const id = Number(idStr);
                  const isActive = draftRoomAmenityIds.includes(id);
                  const Icon = config.icon;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleToggleRoomAmenity(id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-frui-orange bg-frui-orange text-frui-white shadow-sm scale-[1.02]'
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

        <div className="flex justify-between border-t border-frui-blue/10 pt-4 mt-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-xl border border-frui-orange bg-transparent px-4 py-2 text-sm font-semibold text-frui-orange hover:bg-frui-orange/10 transition-all cursor-pointer"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-frui-orange px-4 py-2 text-sm font-semibold text-frui-white shadow-sm hover:brightness-95 active:scale-95 transition-all cursor-pointer"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
