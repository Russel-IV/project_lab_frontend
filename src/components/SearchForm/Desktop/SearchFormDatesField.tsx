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

  /**
   * Custom date selection handler:
   * 1. The first click marks the check-in date.
   * 2. If the second click is before the current check-in, it becomes the new check-in.
   *    Otherwise, it is the new check-out.
   * 3. Once both dates are marked, the next click will mark the check-in and clear check-out.
   */
  const handleSelect = (_range: DateRange | undefined, selectedDay: Date) => {
    if (!selectedDay) return;

    const clickedDay = new Date(selectedDay);
    clickedDay.setHours(0, 0, 0, 0);

    const hasOnlyCheckIn = !!checkInValue && !checkOutValue;

    if (hasOnlyCheckIn) {
      const checkInDate = new Date(checkInValue + 'T00:00:00');
      if (clickedDay < checkInDate) {
        // Clicked date is before current check-in: update check-in, clear check-out
        onDatesChange(format(clickedDay, 'yyyy-MM-dd'), '');
      } else {
        // Clicked date is on or after check-in: update check-out (complete range)
        onDatesChange(checkInValue, format(clickedDay, 'yyyy-MM-dd'));
      }
    } else {
      // First click, or both dates were already set: set check-in, clear check-out
      onDatesChange(format(clickedDay, 'yyyy-MM-dd'), '');
    }
  };

  /**
   * Hook into popover open/close:
   * Whenever the user only has the check-in date, when they click outside the popover,
   * the check-out will automatically default to the check-in date plus one day.
   */
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
