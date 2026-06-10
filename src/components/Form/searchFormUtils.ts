import { parse, format, isValid } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { staysData } from '@/lib/staysData';

export const staysOptions = staysData.map((stay) => stay.title);

export const travelersOptions = [
  '6 travelers, 2 rooms',
  '1 adult',
  '2 adults, 1 child',
  '3 adults, 1 room',
  '4 adults, 2 rooms',
];

export const getNextTravelerValue = (currentVal: string): string => {
  const idx = travelersOptions.indexOf(currentVal);
  if (idx === -1) return travelersOptions[0];
  return travelersOptions[(idx + 1) % travelersOptions.length];
};

export const parseDatesString = (str: string): DateRange => {
  const defaultRange: DateRange = { from: undefined, to: undefined };
  if (!str) return defaultRange;

  try {
    const parts = str.split(' - ');
    const currentYear = new Date().getFullYear();

    const parsePart = (part: string): Date | undefined => {
      const subparts = part.split(',');
      const dateStr = subparts[subparts.length - 1].trim(); // Get "Jun 25"
      const parsed = parse(
        `${dateStr}, ${currentYear}`,
        'MMM d, yyyy',
        new Date(),
      );
      return isValid(parsed) ? parsed : undefined;
    };

    if (parts.length === 2) {
      const fromDate = parsePart(parts[0]);
      const toDate = parsePart(parts[1]);
      if (fromDate && toDate) {
        return { from: fromDate, to: toDate };
      }
    } else if (parts.length === 1 && parts[0]) {
      const fromDate = parsePart(parts[0]);
      if (fromDate) {
        return { from: fromDate, to: undefined };
      }
    }
  } catch (e) {
    console.error('Failed to parse dates string:', e);
  }
  return defaultRange;
};

export const formatDatesRange = (range: DateRange | undefined): string => {
  if (!range || !range.from) return '';
  if (!range.to) {
    return format(range.from, 'eee, MMM d');
  }
  return `${format(range.from, 'eee, MMM d')} - ${format(range.to, 'eee, MMM d')}`;
};
