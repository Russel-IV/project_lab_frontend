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
