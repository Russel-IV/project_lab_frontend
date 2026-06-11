import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchForm } from './SearchFormContext';
import { FormField } from './FormField';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { parseISOToDateRange, formatDatesRange } from './searchFormUtils';

export const SearchFormDatesField: React.FC = () => {
  const { checkInValue, checkOutValue, onDatesChange } = useSearchForm();

  // Parse checkIn and checkOut ISO strings back into a DateRange object
  const selectedRange = React.useMemo<DateRange>(() => {
    return parseISOToDateRange(checkInValue, checkOutValue);
  }, [checkInValue, checkOutValue]);

  // Format the range for user display in the FormField
  const displayValue = React.useMemo(() => {
    const isSameDay =
      selectedRange.from &&
      selectedRange.to &&
      selectedRange.from.getTime() === selectedRange.to.getTime();

    if (!selectedRange.from || isSameDay) {
      return 'Select a range date';
    }
    return formatDatesRange(selectedRange);
  }, [selectedRange]);

  const handleSelect = (newRange: DateRange | undefined) => {
    const isCompleteRange =
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from.getTime() !== selectedRange.to.getTime();

    if (isCompleteRange) {
      onDatesChange('', '');
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
    <Popover>
      <PopoverTrigger
        render={
          <FormField
            label="Dates"
            value={displayValue}
            onClick={() => {}}
            icon={<CalendarIcon className="w-5 h-5" strokeWidth={1.5} />}
          />
        }
      />
      <PopoverContent className="w-auto p-0 bg-white border border-[#d6c7b9] rounded-lg shadow-xl text-[#121324] z-50">
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
