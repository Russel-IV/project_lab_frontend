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
  billingCountry: z.string().min(1, 'Please select a country.'),
  billingAddress1: z.string().min(1, 'Please enter a billing address.'),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(1, 'Please enter a city.'),
  billingState: z.string().min(1, 'Please enter a state/province.'),
  billingPostalCode: z.string().min(1, 'Please enter a postal code.'),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
