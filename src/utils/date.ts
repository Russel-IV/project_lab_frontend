import { startOfDay } from 'date-fns';
import { type DateRange } from 'react-day-picker';

/**
 * Calculates the number of nights between check-in and check-out dates.
 * Defaults to 1 if check-in or check-out is missing.
 *
 * @param dateRange - The selected date range.
 */
export function calculateNights(dateRange: DateRange): number {
  if (!dateRange.from || !dateRange.to) return 1;
  const fromDate = startOfDay(dateRange.from);
  const toDate = startOfDay(dateRange.to);
  const diffTime = toDate.getTime() - fromDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}
