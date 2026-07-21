import { useFormContext } from 'react-hook-form';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Input } from '@/components/ui/input';
import { ShieldAlert } from 'lucide-react';
import visaLogo from '@/assets/images/visa-svgrepo-com.svg';
import mastercardLogo from '@/assets/images/mastercard-svgrepo-com.svg';

// Values are ISO 3166-1 alpha-2 codes — required as-is by Stripe's
// billing_details.address.country when confirming a payment.
const COUNTRIES = [
  { code: 'US', label: 'United States of America' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CL', label: 'Chile' },
  { code: 'AU', label: 'Australia' },
  { code: 'BR', label: 'Brazil' },
  { code: 'MX', label: 'Mexico' },
  { code: 'DE', label: 'Germany' },
  { code: 'JP', label: 'Japan' },
];

// Billing name/address are collected via the app's own fields (below) rather
// than the Payment Element's built-in copies, so the existing custom-styled
// inputs and their zod validation keep working as before.
const PAYMENT_ELEMENT_OPTIONS = {
  fields: {
    billingDetails: { name: 'never', address: 'never' },
  },
} as const;

interface PaymentElementFormProps {
  variant: 'mobile' | 'desktop';
}

export default function PaymentElementForm({
  variant,
}: PaymentElementFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const content = (
    <>
      <div className="flex gap-2 items-center">
        <img
          src={mastercardLogo}
          alt="Mastercard"
          className="w-10 h-6 rounded border border-neutral-200 object-contain bg-white p-0.5"
        />
        <img
          src={visaLogo}
          alt="Visa"
          className="w-10 h-6 rounded border border-neutral-200 object-contain bg-white p-0.5"
        />
      </div>

      <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />

      {/* Name on Card */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">
          Name on Card *
        </label>
        <Input
          {...register('cardName')}
          aria-invalid={!!errors.cardName}
          className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
        />
        {errors.cardName && (
          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
            <ShieldAlert className="size-3 shrink-0" />
            {errors.cardName.message as string}
          </span>
        )}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5 border-t border-neutral-200 pt-4">
        <label className="text-xs font-bold text-frui-blue">
          Country/Territory *
        </label>
        <select
          {...register('billingCountry')}
          className="h-10 rounded-lg border border-neutral-300 px-3 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Billing Address 1 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">
          Billing address 1 *
        </label>
        <Input
          placeholder="(ex. 123 Main)"
          {...register('billingAddress1')}
          aria-invalid={!!errors.billingAddress1}
          className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
        />
        {errors.billingAddress1 && (
          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
            <ShieldAlert className="size-3 shrink-0" />
            {errors.billingAddress1.message as string}
          </span>
        )}
      </div>

      {/* Billing Address 2 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">
          Billing address 2
        </label>
        <Input
          placeholder="(ex. Suite 400, Apt. 4B)"
          {...register('billingAddress2')}
          className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
        />
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">City *</label>
        <Input
          {...register('billingCity')}
          aria-invalid={!!errors.billingCity}
          className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
        />
        {errors.billingCity && (
          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
            <ShieldAlert className="size-3 shrink-0" />
            {errors.billingCity.message as string}
          </span>
        )}
      </div>

      {/* State/Province + Postal code */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            State/Province *
          </label>
          <Input
            placeholder="(ex. CA)"
            {...register('billingState')}
            aria-invalid={!!errors.billingState}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.billingState && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.billingState.message as string}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Postal code *
          </label>
          <Input
            placeholder="(ex. 94103)"
            {...register('billingPostalCode')}
            aria-invalid={!!errors.billingPostalCode}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.billingPostalCode && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.billingPostalCode.message as string}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-frui-blue tracking-tight">
          Payment method
        </h1>
        {content}
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 border-t border-neutral-100 pt-5 flex flex-col gap-4">
      {content}
    </div>
  );
}
