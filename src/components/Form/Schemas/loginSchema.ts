import { z } from 'zod';

/**
 * Zod validation schema for the login form.
 */
export const loginSchema = z.object({
  email: z.pipe(
    z.string().min(1, 'Please enter an email address.'),
    z.email('Please enter a valid email address.'),
  ),
  password: z.string().min(1, 'Please enter your password.'),
  rememberMe: z.boolean(),
});

/**
 * Inferred TypeScript type for the login form values.
 */
export type LoginFormValues = z.infer<typeof loginSchema>;
