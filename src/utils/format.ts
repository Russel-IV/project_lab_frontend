import { parse, format } from 'date-fns';

/**
 * Formats a nightly or total price according to currency rules.
 * Stays with prices < 10000 are treated as USD, otherwise CLP.
 *
 * @param price - The numeric price to format.
 * @param useDesktopStyle - Whether to include space and 'USD' suffix (e.g. "$ 51 USD" vs "$51").
 */
export function formatPrice(price: number, useDesktopStyle = false): string {
  const isUSD = price < 10000;
  if (isUSD) {
    return useDesktopStyle ? `$ ${price} USD` : `$${price}`;
  }
  return `CLP ${price.toLocaleString('de-DE')}`;
}

/**
 * Formats travelers/rooms string to display guest count.
 * (e.g., "1 travelers, 1 rooms" -> "1 guest")
 *
 * @param travelers - The raw travelers value string.
 */
export function formatTravelers(travelers?: string | null): string {
  if (!travelers) return '1 guest';
  const match = travelers.match(/^(\d+)\s+travelers?/i);
  if (match) {
    const count = parseInt(match[1], 10);
    return `${count} ${count === 1 ? 'guest' : 'guests'}`;
  }
  return travelers;
}

/**
 * Generates the cancellation text for a stay.
 * Returns null if the stay is not refundable.
 *
 * @param isRefundable - Whether the stay is refundable.
 * @param checkIn - ISO check-in date string.
 */
export function getFreeCancellationText(
  isRefundable: boolean,
  checkIn?: string,
): string | null {
  if (!isRefundable) return null;
  if (!checkIn) return '$ 0 today · Free cancellation';
  try {
    const checkInDate = parse(checkIn, 'yyyy-MM-dd', new Date());
    const cancelDate = new Date(checkInDate.getTime() - 24 * 60 * 60 * 1000);
    return `$ 0 today · Free cancellation before ${format(cancelDate, 'MMMM d')}`;
  } catch {
    return '$ 0 today · Free cancellation';
  }
}

/**
 * Plain-language cancellation policy description for the stay Policies
 * section. Unlike getFreeCancellationText (which powers the booking widget's
 * banner and hardcodes a 1-day cutoff), this honors the stay's actual
 * daysFromBookingCancellationDeadline.
 *
 * @param isRefundable - Whether the stay is refundable.
 * @param daysFromBookingCancellationDeadline - Days before check-in the free
 *   cancellation window closes. Falls back to 1 when null.
 * @param checkIn - ISO check-in date string.
 */
export function getCancellationPolicyText(
  isRefundable: boolean,
  daysFromBookingCancellationDeadline: number | null | undefined,
  checkIn?: string,
): string {
  if (!isRefundable) return 'Non-refundable';
  if (!checkIn) {
    return 'Free cancellation available · exact deadline depends on your selected dates';
  }
  try {
    const checkInDate = parse(checkIn, 'yyyy-MM-dd', new Date());
    const deadlineDays = daysFromBookingCancellationDeadline ?? 1;
    const deadline = new Date(
      checkInDate.getTime() - deadlineDays * 24 * 60 * 60 * 1000,
    );
    return `Free cancellation before ${format(deadline, 'MMMM d')}`;
  } catch {
    return 'Free cancellation available · exact deadline depends on your selected dates';
  }
}

/**
 * Formats a "HH:mm" 24h time string (e.g. from a stay's check-in/check-out
 * fields) into a display string like "3:00 PM". Returns the raw input
 * unchanged if it doesn't parse.
 *
 * @param time - 24h time string, e.g. "15:00".
 */
export function formatPolicyTime(time: string): string {
  try {
    const parsed = parse(time, 'HH:mm', new Date());
    if (isNaN(parsed.getTime())) return time;
    return format(parsed, 'h:mm a');
  } catch {
    return time;
  }
}

/**
 * Splits free-text policy fields (e.g. policiesText, importantInformation,
 * houseRulesText) into trimmed, non-empty lines for bullet-list rendering.
 *
 * @param text - Raw free-text field, newline-separated.
 */
export function splitToBullets(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
