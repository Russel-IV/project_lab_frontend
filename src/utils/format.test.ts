import { describe, expect, it } from 'vitest';
import {
  calculateTotalPrice,
  formatMaskedCard,
  formatPolicyTime,
  formatPrice,
  getCancellationPolicyText,
  splitToBullets,
} from './format';

describe('getCancellationPolicyText', () => {
  it('returns "Non-refundable" when the stay is not refundable', () => {
    expect(getCancellationPolicyText(false, 5, '2026-08-01')).toBe(
      'Non-refundable',
    );
  });

  it('computes the deadline from daysFromBookingCancellationDeadline', () => {
    expect(getCancellationPolicyText(true, 5, '2026-08-10')).toBe(
      'Free cancellation before August 5',
    );
  });

  it('falls back to a 1-day deadline when the field is null', () => {
    expect(getCancellationPolicyText(true, null, '2026-08-10')).toBe(
      'Free cancellation before August 9',
    );
  });

  it('returns a generic message when no check-in date is selected', () => {
    expect(getCancellationPolicyText(true, 5, undefined)).toBe(
      'Free cancellation available · exact deadline depends on your selected dates',
    );
  });
});

describe('formatPolicyTime', () => {
  it('formats a 24h "HH:mm" time to a 12h display string', () => {
    expect(formatPolicyTime('15:00')).toBe('3:00 PM');
    expect(formatPolicyTime('11:00')).toBe('11:00 AM');
  });

  it('returns the raw input when it cannot be parsed', () => {
    expect(formatPolicyTime('not-a-time')).toBe('not-a-time');
  });
});

describe('splitToBullets', () => {
  it('splits newline-separated text into trimmed, non-empty lines', () => {
    expect(
      splitToBullets('No smoking\n  No pets  \n\nQuiet after 10pm'),
    ).toEqual(['No smoking', 'No pets', 'Quiet after 10pm']);
  });

  it('returns an empty array for null/undefined/empty input', () => {
    expect(splitToBullets(null)).toEqual([]);
    expect(splitToBullets(undefined)).toEqual([]);
    expect(splitToBullets('')).toEqual([]);
  });
});

describe('formatMaskedCard', () => {
  it('masks a card down to its last four digits', () => {
    expect(formatMaskedCard('1234')).toBe('•••• •••• •••• 1234');
  });
});

describe('calculateTotalPrice', () => {
  it('multiplies the nightly rate by the number of nights', () => {
    expect(calculateTotalPrice(100, '2026-08-01', '2026-08-04')).toBe(300);
  });

  it('clamps to a minimum of 1 night when checkIn === checkOut', () => {
    expect(calculateTotalPrice(100, '2026-08-01', '2026-08-01')).toBe(100);
  });

  it('defaults to 1 night when checkOut is empty or missing', () => {
    expect(calculateTotalPrice(100, '2026-08-01', '')).toBe(100);
    expect(calculateTotalPrice(100, '2026-08-01', undefined)).toBe(100);
    expect(calculateTotalPrice(100, '', '')).toBe(100);
  });

  it('formats below/above the USD-CLP threshold correctly with two decimals', () => {
    expect(
      formatPrice(calculateTotalPrice(100, '2026-08-01', '2026-08-04')),
    ).toBe('$300.00');
    expect(
      formatPrice(calculateTotalPrice(100, '2026-08-01', '2026-08-04'), true),
    ).toBe('$ 300.00 USD');
    expect(
      formatPrice(calculateTotalPrice(5000, '2026-08-01', '2026-08-04')),
    ).toBe(
      `CLP ${(15000).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    );
  });
});
