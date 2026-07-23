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
import { RangeCalendar } from '@/components/calendar';
import { type DateRange } from 'react-day-picker';
import { parseISOToDateRange, formatDatesRange } from '../searchFormUtils';

export const SearchFormDatesField: React.FC = () => {
  const { checkInValue, checkOutValue, onDatesChange } = useSearchForm();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedRange = React.useMemo<DateRange>(() => {
    return parseISOToDateRange(checkInValue, checkOutValue);
  }, [checkInValue, checkOutValue]);

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

  const handleSelect = (_range: DateRange | undefined, selectedDay: Date) => {
    if (!selectedDay) return;

    const clickedDay = new Date(selectedDay);
    clickedDay.setHours(0, 0, 0, 0);

    const hasOnlyCheckIn = !!checkInValue && !checkOutValue;

    if (hasOnlyCheckIn) {
      const checkInDate = new Date(checkInValue + 'T00:00:00');
      if (clickedDay < checkInDate) {
        onDatesChange(format(clickedDay, 'yyyy-MM-dd'), '');
      } else {
        onDatesChange(checkInValue, format(clickedDay, 'yyyy-MM-dd'));
      }
    } else {
      onDatesChange(format(clickedDay, 'yyyy-MM-dd'), '');
    }
  };

  // Closing with only a check-in set defaults check-out to check-in + 1 day.
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      if (checkInValue && !checkOutValue) {
        const checkInDate = new Date(checkInValue + 'T00:00:00');
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 1);
        onDatesChange(checkInValue, format(checkOutDate, 'yyyy-MM-dd'));
      }
    }
  };

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
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
        <RangeCalendar
          selected={selectedRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={{ before: today }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default SearchFormDatesField;
