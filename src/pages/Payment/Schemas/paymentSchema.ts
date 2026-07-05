import { z } from 'zod';

export const paymentSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Please enter a first name.')
    .regex(/^[a-zA-Z\s]+$/, 'Please enter a first name using letters only.'),
  lastName: z
    .string()
    .min(1, 'Please enter a last name.')
    .regex(/^[a-zA-Z\s]+$/, 'Please enter a last name using letters only.'),
  email: z
    .string()
    .min(1, 'Please enter an email address.')
    .email('Please enter a valid email address.'),
  countryCode: z.string().min(1, 'Please select a country code.'),
  phone: z.string().min(1, 'Please enter a phone number.'),

  cardName: z.string().min(1, 'Please enter the name on the card.'),
  cardNumber: z
    .string()
    .min(1, 'Please enter a card number.')
    .refine(
      (val) => {
        const clean = val.replace(/\s+/g, '');
        return /^\d{16}$/.test(clean);
      },
      {
        message: 'Please enter a valid 16-digit card number.',
      },
    ),
  cardExpiryMonth: z.string().min(1, 'Please select a month.'),
  cardExpiryYear: z.string().min(1, 'Please select a year.'),
  cardCvv: z
    .string()
    .min(1, 'Please enter a security code.')
    .regex(/^\d{3,4}$/, 'Please enter a valid CVV (3 or 4 digits).'),
  billingCountry: z.string().min(1, 'Please select a country.'),
  billingAddress1: z.string().min(1, 'Please enter a billing address.'),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(1, 'Please enter a city.'),

  // Desktop specific
  payWhen: z.enum(['now', 'later']),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
