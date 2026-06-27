import React from 'react';
import { Search } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import {
  parseISOToDateRange,
  formatDatesRange,
} from '@/components/Form/searchFormUtils';

interface SearchFormMobileTriggerProps {
  onClick: () => void;
}

/**
 * SearchFormMobileTrigger
 *
 * Renders a compact search bar trigger designed for mobile views.
 * It displays the current search state (place, dates, travelers)
 * and opens the mobile search modal on click.
 */
export const SearchFormMobileTrigger: React.FC<
  SearchFormMobileTriggerProps
> = ({ onClick }) => {
  const { place, checkIn, checkOut, travelers } = useAppSelector(
    (state) => state.search,
  );

  // Parse and format current dates
  const dateRange = React.useMemo(() => {
    return parseISOToDateRange(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const datesText = React.useMemo(() => {
    if (!dateRange.from) return 'Any dates';
    return formatDatesRange(dateRange);
  }, [dateRange]);

  // Extract total travelers count if possible, or use raw value
  const travelersText = React.useMemo(() => {
    if (!travelers) return 'Any guests';
    const match = travelers.match(/^(\d+)\s+travelers?/i);
    if (match) {
      const count = match[1];
      return `${count} ${parseInt(count, 10) === 1 ? 'guest' : 'guests'}`;
    }
    return travelers;
  }, [travelers]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-frui-white border border-[#d6c7b9] rounded-full px-4 py-3 shadow-sm text-left text-frui-blue cursor-pointer select-none"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-frui-orange/10 text-frui-orange">
        <Search className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-bold truncate text-frui-blue">
          {place || 'Where to?'}
        </span>
        <span className="text-xs text-[#877D74] truncate">
          {datesText} • {travelersText}
        </span>
      </div>
    </button>
  );
};

export default SearchFormMobileTrigger;
