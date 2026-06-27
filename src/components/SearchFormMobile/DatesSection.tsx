import React, { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useSearchFormMobile } from './SearchFormMobileContext';
import { parseISOToDateRange } from '@/components/Form/searchFormUtils';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';

/**
 * DatesSection
 *
 * Renders the calendar picker.
 * Supports collapsed and expanded accordion modes.
 * Displays a 4-month vertically scrollable calendar.
 */
export const DatesSection: React.FC = () => {
  const {
    localCheckIn,
    localCheckOut,
    activeSection,
    setActiveSection,
    handleSelectDates,
    displayDatesValue,
  } = useSearchFormMobile();

  const selectedRange = useMemo<DateRange>(() => {
    return parseISOToDateRange(localCheckIn, localCheckOut);
  }, [localCheckIn, localCheckOut]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isExpanded = activeSection === 'dates';

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setActiveSection('dates')}
        className="bg-frui-white rounded-2xl p-4 flex justify-between items-center shadow-sm cursor-pointer select-none text-left w-full border-0"
      >
        <span className="text-sm text-[#877D74] font-medium">Dates</span>
        <span className="text-sm text-frui-blue font-bold">
          {displayDatesValue}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-frui-white rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-frui-blue">
        When are you traveling?
      </h2>
      <div className="overflow-y-auto max-h-[380px] w-full flex justify-center pr-1 border-t border-b border-neutral-100 py-3 scrollbar-thin">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleSelectDates}
          numberOfMonths={4}
          disableNavigation
          disabled={{ before: today }}
          showOutsideDays={false}
          className="w-full flex justify-center border-0 p-0 bg-transparent [--cell-size:44px] [&_button]:text-sm [&_button]:font-semibold"
          classNames={{
            nav: 'hidden',
            weekday:
              'text-sm font-bold text-[#877D74] flex-none w-(--cell-size) h-(--cell-size) flex items-center justify-center',
            caption_label: 'text-base font-bold text-frui-blue capitalize',
          }}
          formatters={{
            formatWeekdayName: (day) => {
              const dayIndex = day.getDay();
              const englishWeekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
              return englishWeekdays[dayIndex];
            },
            formatCaption: (date) => {
              return format(date, 'MMMM yyyy');
            },
          }}
        />
      </div>
    </div>
  );
};

export default DatesSection;
