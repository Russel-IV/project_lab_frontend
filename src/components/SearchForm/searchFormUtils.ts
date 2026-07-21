import { parse, format, isValid } from 'date-fns';
import { type DateRange } from 'react-day-picker';

/**
 * Parses checkIn and checkOut ISO strings back into a DateRange object.
 *
 * @param checkIn - The check-in ISO date string.
 * @param checkOut - The check-out ISO date string.
 * @returns A DateRange object.
 */
export const parseISOToDateRange = (
  checkIn?: string,
  checkOut?: string,
): DateRange => {
  try {
    const from = checkIn ? parse(checkIn, 'yyyy-MM-dd', new Date()) : undefined;
    const to = checkOut ? parse(checkOut, 'yyyy-MM-dd', new Date()) : undefined;
    return { from, to };
  } catch (e) {
    console.error('Failed to parse date range strings:', e);
    return { from: undefined, to: undefined };
  }
};

/**
 * Formats a DateRange object into a user-friendly string range.
 *
 * @param range - The DateRange object.
 * @returns Formatted date range string (e.g., "Thu, Jun 25 - Sun, Jun 28").
 */
export const formatDatesRange = (range: DateRange | undefined): string => {
  if (!range || !range.from || !isValid(range.from)) return '';
  if (!range.to || !isValid(range.to)) {
    return format(range.from, 'eee, MMM d');
  }
  return `${format(range.from, 'eee, MMM d')} - ${format(range.to, 'eee, MMM d')}`;
};

/**
 * Checks whether a checkIn/checkOut pair of 'yyyy-MM-dd' strings forms a
 * valid, non-empty, correctly-ordered date range.
 *
 * @param checkIn - The check-in ISO date string.
 * @param checkOut - The check-out ISO date string.
 * @returns Whether the range is valid and searchable.
 */
export const isValidDateRange = (
  checkIn: string,
  checkOut: string,
): boolean => {
  return !!checkIn && !!checkOut && checkIn <= checkOut;
};

/**
 * Represents the configuration of a single room.
 */
export interface RoomConfig {
  id: number;
  adults: number;
}

/**
 * Parses a travelers config string (e.g., "6 travelers, 2 rooms")
 * into an array of RoomConfig objects representing each room and its adult count.
 *
 * @param val - The formatted travelers string.
 * @returns An array of RoomConfig objects.
 */
export const parseTravelersValue = (val: string): RoomConfig[] => {
  if (!val) return [{ id: 1, adults: 2 }];

  const roomsMatch = val.match(/(\d+)\s+rooms?/i);
  const adultsMatch = val.match(/(\d+)\s+(adults?|travelers?)/i);

  const roomCount = Math.max(1, roomsMatch ? parseInt(roomsMatch[1], 10) : 1);
  const totalAdults = adultsMatch ? parseInt(adultsMatch[1], 10) : 2; // default to 2 adults if not found

  const baseAdults = Math.floor(totalAdults / roomCount);
  const remainder = totalAdults % roomCount;

  const configs: RoomConfig[] = [];
  for (let i = 0; i < roomCount; i++) {
    configs.push({
      id: i + 1,
      adults: Math.max(1, baseAdults + (i < remainder ? 1 : 0)),
    });
  }
  return configs;
};

/**
 * Serializes an array of RoomConfig objects into a user-friendly string
 * (e.g., "6 travelers, 2 rooms").
 *
 * @param rooms - An array of RoomConfig objects.
 * @returns The formatted travelers/rooms count string.
 */
export const serializeTravelersValue = (rooms: RoomConfig[]): string => {
  const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
  const roomCount = rooms.length;

  const travelerText = totalAdults === 1 ? 'traveler' : 'travelers';
  const roomText = roomCount === 1 ? 'room' : 'rooms';

  return `${totalAdults} ${travelerText}, ${roomCount} ${roomText}`;
};

/**
 * A destination the user previously searched for, persisted to localStorage.
 * `regionId` is only present when the entry came from picking a real
 * suggestion - a plain typed-and-submitted string has none.
 */
export interface RecentSearch {
  label: string;
  regionId?: number;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const RECENT_SEARCHES_LIMIT = 5;

/**
 * Reads `recent_searches` from localStorage, normalizing the older
 * `string[]` shape (from before regionId existed) into `RecentSearch[]` so
 * previously-saved entries keep working as free-text-only recents.
 */
export const getRecentSearches = (): RecentSearch[] => {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || '[]',
    );
    if (!Array.isArray(raw)) return [];
    return raw.map((item) =>
      typeof item === 'string' ? { label: item } : (item as RecentSearch),
    );
  } catch (e) {
    console.error('Failed to read recent searches from localStorage:', e);
    return [];
  }
};

/**
 * Saves a new recent search, de-duplicated by label, most-recent-first,
 * capped at RECENT_SEARCHES_LIMIT entries.
 */
export const saveRecentSearch = (entry: RecentSearch): void => {
  try {
    const existing = getRecentSearches();
    const updated = [
      entry,
      ...existing.filter((item) => item.label !== entry.label),
    ].slice(0, RECENT_SEARCHES_LIMIT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save recent search to localStorage:', e);
  }
};

/**
 * Extracts the total number of guests from a travelers config string
 * (e.g., "6 travelers, 2 rooms" -> 6), for use as a search filter value.
 *
 * @param val - The formatted travelers string.
 * @returns The total guest count, or 0 if it can't be parsed.
 */
export const getTotalGuests = (val: string): number => {
  if (!val) return 0;
  const adultsMatch = val.match(/(\d+)\s+(adults?|travelers?)/i);
  return adultsMatch ? parseInt(adultsMatch[1], 10) : 0;
};
