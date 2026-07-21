// Gates the real Stripe checkout UI. Off (no key set) preserves today's
// mock card-entry flow so environments without the backend payment-intent
// contract wired up aren't broken.
export const STRIPE_CHECKOUT_ENABLED = Boolean(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
);
