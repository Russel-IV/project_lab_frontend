import React, { lazy, Suspense } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { useSearchForm } from './SearchFormContext';
import { FormField } from './FormField';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { type DateRange } from 'react-day-picker';
import { parseISOToDateRange, formatDatesRange } from '../searchFormUtils';

const RangeCalendar = lazy(() =>
  import('@/components/calendar').then((m) => ({
    default: m.RangeCalendar,
  })),
);

/**
 * Renders the date selection field with a range calendar popover.
 */
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

  /**
   * Handles selection of date ranges within the calendar.
   *
   * @param _range - The date range object selected in the calendar.
   * @param selectedDay - The specific day clicked by the user.
   */
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

  /**
   * Handles visibility state changes of the popover.
   *
   * @param open - Indicates whether the popover is open.
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
      <PopoverContent className="h-[420px] w-[600px] bg-frui-white border border-border shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-3xl p-6 z-50 flex flex-col justify-center select-none">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">
              Loading calendar…
            </div>
          }
        >
          <RangeCalendar
            defaultMonth={selectedRange.from || new Date()}
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date < startOfDay(new Date())}
          />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFormDatesField;
