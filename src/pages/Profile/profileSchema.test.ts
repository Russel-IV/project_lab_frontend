import { describe, expect, it } from 'vitest';
import {
  generalInfoSchema,
  personalInfoSchema,
  paymentMethodSchema,
  changePasswordSchema,
} from './profileSchema';

describe('generalInfoSchema', () => {
  it('accepts a non-empty name', () => {
    expect(generalInfoSchema.safeParse({ name: 'Ada Lovelace' }).success).toBe(
      true,
    );
  });

  it('rejects an empty name', () => {
    expect(generalInfoSchema.safeParse({ name: '' }).success).toBe(false);
  });
});

describe('personalInfoSchema', () => {
  const valid = { email: 'ada@example.com', phone: '5551234567' };

  it('accepts valid personal info', () => {
    expect(personalInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an invalid email format', () => {
    const result = personalInfoSchema.safeParse({
      ...valid,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email']);
    }
  });

  it('allows an empty phone (backend permits a null phone, e.g. right after signup)', () => {
    expect(personalInfoSchema.safeParse({ ...valid, phone: '' }).success).toBe(
      true,
    );
  });
});

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'oldpassword123',
    newPassword: 'newpassword123',
    confirmNewPassword: 'newpassword123',
  };

  it('accepts matching, long-enough passwords', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a mismatched confirmation, attaching the error to confirmNewPassword', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      confirmNewPassword: 'somethingelse',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmNewPassword']);
      expect(result.error.issues[0].message).toBe('Passwords do not match.');
    }
  });

  it('rejects a new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      newPassword: 'short',
      confirmNewPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty current password', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      currentPassword: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('paymentMethodSchema', () => {
  const futureYear = String(new Date().getFullYear() + 5);
  const valid = {
    cardholderName: 'Ada Lovelace',
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: futureYear,
    cvv: '123',
  };

  it('accepts a valid, non-expired card', () => {
    expect(paymentMethodSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a card number that is not 13-19 digits', () => {
    const result = paymentMethodSchema.safeParse({
      ...valid,
      cardNumber: '123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an expired card, attaching the error to expiryYear', () => {
    const result = paymentMethodSchema.safeParse({
      ...valid,
      expiryMonth: '01',
      expiryYear: '2020',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['expiryYear']);
      expect(result.error.issues[0].message).toBe('This card has expired.');
    }
  });

  it('rejects an invalid CVV', () => {
    const result = paymentMethodSchema.safeParse({ ...valid, cvv: '12' });
    expect(result.success).toBe(false);
  });
});
