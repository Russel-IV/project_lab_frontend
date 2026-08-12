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
  const { checkInValue, checkOutValue, onDatesChange, onSubmit } =
    useSearchForm();
  const [isOpen, setIsOpen] = React.useState(false);

  // Local state for dates while calendar popover is active
  const [tempCheckIn, setTempCheckIn] = React.useState(checkInValue);
  const [tempCheckOut, setTempCheckOut] = React.useState(checkOutValue);

  /**
   * Handles visibility state changes of the popover.
   * Synchronizes local state when opened, and commits to Redux/submits when closed.
   *
   * @param open - Indicates whether the popover is open.
   */
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      setTempCheckIn(checkInValue);
      setTempCheckOut(checkOutValue);
    } else {
      const finalCheckIn = tempCheckIn;
      let finalCheckOut = tempCheckOut;

      if (finalCheckIn && !finalCheckOut) {
        const checkInDate = new Date(finalCheckIn + 'T00:00:00');
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 1);
        finalCheckOut = format(checkOutDate, 'yyyy-MM-dd');
      }

      onDatesChange(finalCheckIn, finalCheckOut);
      onSubmit();
    }
  };

  const activeCheckIn = isOpen ? tempCheckIn : checkInValue;
  const activeCheckOut = isOpen ? tempCheckOut : checkOutValue;

  const selectedRange = React.useMemo<DateRange>(() => {
    return parseISOToDateRange(activeCheckIn, activeCheckOut);
  }, [activeCheckIn, activeCheckOut]);

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

    const hasOnlyCheckIn = !!tempCheckIn && !tempCheckOut;

    if (hasOnlyCheckIn) {
      const checkInDate = new Date(tempCheckIn + 'T00:00:00');
      if (clickedDay < checkInDate) {
        setTempCheckIn(format(clickedDay, 'yyyy-MM-dd'));
        setTempCheckOut('');
      } else {
        setTempCheckOut(format(clickedDay, 'yyyy-MM-dd'));
      }
    } else {
      setTempCheckIn(format(clickedDay, 'yyyy-MM-dd'));
      setTempCheckOut('');
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
