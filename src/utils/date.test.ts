import { describe, expect, it } from 'vitest';
import { isCardExpired } from './date';

describe('isCardExpired', () => {
  it('returns true for a card that expired in a past year', () => {
    expect(isCardExpired('05', '2020')).toBe(true);
  });

  it('returns false for a card expiring years in the future', () => {
    const futureYear = new Date().getFullYear() + 5;
    expect(isCardExpired('12', String(futureYear))).toBe(false);
  });

  it('returns false for a card expiring the current month (not yet expired)', () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    expect(isCardExpired(month, year)).toBe(false);
  });

  it('returns false when month or year is missing/invalid', () => {
    expect(isCardExpired('', '2020')).toBe(false);
    expect(isCardExpired('05', '')).toBe(false);
  });
});
