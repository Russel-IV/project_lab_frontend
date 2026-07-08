export const SITE_NAME = 'Frui';

export const DEFAULT_DESCRIPTION =
  'Book stays, flights, cars, things to do, and cruises with Frui — find exclusive deals on your next trip.';

// Falls back to the actual serving origin so canonical/OG URLs are always
// correct without needing a hardcoded production domain in the client bundle.
export const SITE_URL =
  typeof window !== 'undefined' ? window.location.origin : '';
