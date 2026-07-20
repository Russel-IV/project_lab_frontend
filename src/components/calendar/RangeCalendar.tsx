import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

type CalendarProps = React.ComponentProps<typeof Calendar>;

export const RangeCalendar: React.FC<CalendarProps> = ({
  className,
  classNames,
  formatters,
  ...props
}) => {
  return (
    <Calendar
      mode="range"
      showOutsideDays={false}
      className={`relative w-full flex justify-center border-0 p-0 bg-transparent [--cell-size:36px] [&_button]:text-sm [&_button]:font-semibold ${className || ''}`}
      classNames={{
        weekday:
          'text-sm font-bold text-[#7a7168] flex-none w-(--cell-size) h-(--cell-size) flex items-center justify-center',
        caption_label: 'text-base font-bold text-frui-blue capitalize',
        ...classNames,
      }}
      formatters={{
        formatWeekdayName: (day) => {
          const dayIndex = day.getDay();
          const englishWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
          return englishWeekdays[dayIndex];
        },
        formatCaption: (date) => {
          return format(date, 'MMMM yyyy');
        },
        ...formatters,
      }}
      {...props}
    />
  );
};

export default RangeCalendar;
