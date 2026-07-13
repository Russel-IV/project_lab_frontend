import { endOfMonth, startOfDay } from 'date-fns';
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

/**
 * Whether a card's expiry month/year has already passed. A card expiring
 * this calendar month is still valid until the month ends.
 *
 * @param month - 1-12 (as a string, matching form select values).
 * @param year - 4-digit year (as a string).
 */
export function isCardExpired(month: string, year: string): boolean {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  if (!monthNum || !yearNum) return false;
  const expiry = endOfMonth(new Date(yearNum, monthNum - 1, 1));
  return expiry.getTime() < startOfDay(new Date()).getTime();
}
