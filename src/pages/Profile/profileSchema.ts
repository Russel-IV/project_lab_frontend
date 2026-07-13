import { z } from 'zod';
import { isCardExpired } from '@/utils/date';

export const generalInfoSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter an email address.')
    .email('Please enter a valid email address.'),
  // Optional: the backend allows a null phone (e.g. right after signup), and
  // requiring one here would block saving a name/email-only edit.
  phone: z.string(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password.'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const paymentMethodSchema = z
  .object({
    cardholderName: z.string().min(1, 'Please enter the name on the card.'),
    cardNumber: z
      .string()
      .min(1, 'Please enter a card number.')
      .refine((val) => /^\d{13,19}$/.test(val.replace(/\s+/g, '')), {
        message: 'Please enter a valid card number.',
      }),
    expiryMonth: z.string().min(1, 'Please select a month.'),
    expiryYear: z.string().min(1, 'Please select a year.'),
    cvv: z
      .string()
      .min(1, 'Please enter a security code.')
      .regex(/^\d{3,4}$/, 'Please enter a valid CVV (3 or 4 digits).'),
  })
  .refine((data) => !isCardExpired(data.expiryMonth, data.expiryYear), {
    message: 'This card has expired.',
    path: ['expiryYear'],
  });

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
