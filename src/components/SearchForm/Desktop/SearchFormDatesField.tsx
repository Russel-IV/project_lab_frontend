import React from 'react';
import { format } from 'date-fns';
import { useSearchForm } from './SearchFormContext';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { parseISOToDateRange, formatDatesRange } from '../searchFormUtils';

interface SearchFormDatesFieldProps {
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export const SearchFormDatesField: React.FC<SearchFormDatesFieldProps> = ({
  isActive,
  onActivate,
  onDeactivate,
}) => {
  const { checkInValue, checkOutValue, onDatesChange } = useSearchForm();

  // Parse checkIn and checkOut ISO strings back into a DateRange object
  const selectedRange = React.useMemo<DateRange>(() => {
    return parseISOToDateRange(checkInValue, checkOutValue);
  }, [checkInValue, checkOutValue]);

  // Format the range for user display in the field
  const displayValue = React.useMemo(() => {
    const isSameDay =
      selectedRange.from &&
      selectedRange.to &&
      selectedRange.from.getTime() === selectedRange.to.getTime();

    if (!selectedRange.from || isSameDay) {
      return 'When?';
    }
    return formatDatesRange(selectedRange);
  }, [selectedRange]);

  const handleSelect = (newRange: DateRange | undefined) => {
    const isCompleteRange =
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from.getTime() !== selectedRange.to.getTime();

    if (isCompleteRange) {
      if (newRange?.from) {
        onDatesChange(format(newRange.from, 'yyyy-MM-dd'), '');
      } else {
        onDatesChange('', '');
      }
    } else if (newRange) {
      const fromStr = newRange.from ? format(newRange.from, 'yyyy-MM-dd') : '';
      const toStr = newRange.to ? format(newRange.to, 'yyyy-MM-dd') : '';
      onDatesChange(fromStr, toStr);
    } else {
      onDatesChange('', '');
    }
  };

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <Popover
      open={isActive}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          onActivate();
        } else {
          onDeactivate();
        }
      }}
    >
      <PopoverTrigger
        render={
          <div
            onClick={onActivate}
            className={cn(
              'flex flex-col flex-1 px-4 xl:px-8 py-2.5 xl:py-3 rounded-full cursor-pointer justify-center min-w-0 transition-all duration-150 select-none',
              isActive
                ? 'bg-frui-white shadow-[0_3px_12px_rgba(0,0,0,0.08)]'
                : 'bg-transparent',
            )}
          >
            <span className="text-[10px] xl:text-xs font-bold text-frui-blue uppercase tracking-wider select-none mb-0.5">
              Dates
            </span>
            <span
              className={cn(
                'text-xs xl:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis',
                checkInValue ? 'text-frui-blue' : 'text-gray-400',
              )}
            >
              {displayValue}
            </span>
          </div>
        }
      />
      <PopoverContent className="w-auto p-0 bg-frui-white border border-[#d6c7b9]/50 rounded-2xl shadow-xl text-frui-blue z-50 mt-3">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={{ before: today }}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
};

export default SearchFormDatesField;
