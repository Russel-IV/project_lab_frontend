import { z } from 'zod';

/**
 * Zod validation schema for the signup form.
 */
export const signupSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.pipe(
    z.string().min(1, 'Please enter an email address.'),
    z.email('Please enter a valid email address.'),
  ),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

/**
 * Inferred TypeScript type for the signup form values.
 */
export type SignupFormValues = z.infer<typeof signupSchema>;
