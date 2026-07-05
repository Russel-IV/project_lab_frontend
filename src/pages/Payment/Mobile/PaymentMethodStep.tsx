import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { ShieldAlert, CreditCard } from 'lucide-react';

// Custom Visa and Mastercard SVGs
const VisaIcon = () => (
  <svg
    className="w-10 h-6 rounded border border-neutral-200"
    viewBox="0 0 24 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="15" fill="#1A1F71" />
    <path
      d="M4 11L5.5 4H7L5.5 11H4ZM12 4.3C11.6 4.1 11 4 10.4 4C8.9 4 7.9 4.8 7.9 6C7.9 6.8 8.6 7.3 9.1 7.6C9.7 7.9 9.9 8.1 9.9 8.4C9.9 8.8 9.4 9 9 9C8.4 9 8 8.8 7.7 8.6L7.2 9.7C7.6 9.9 8.2 10 8.8 10C10.4 10 11.4 9.2 11.4 8C11.4 7.2 10.9 6.7 10.1 6.3C9.6 6 9.3 5.8 9.3 5.5C9.3 5.2 9.7 5 10.2 5C10.7 5 11.1 5.1 11.4 5.3L12 4.3ZM16.5 4H15.1C14.7 4 14.4 4.2 14.2 4.6L12.1 9.6H13.7L14 8.7H15.8L16 9.6H17.5L16.5 4ZM14.4 7.5L14.9 5.8L15.4 7.5H14.4ZM20 4H18.5L16.7 9.6H18.2L18.5 8.7H20.3L20.4 9.6H21.9L20 4ZM18.8 7.5L19.4 5.8L19.9 7.5H18.8Z"
      fill="white"
    />
  </svg>
);

const MastercardIcon = () => (
  <svg
    className="w-10 h-6 rounded border border-neutral-200"
    viewBox="0 0 24 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="15" fill="#0A0A0A" />
    <circle cx="9.5" cy="7.5" r="4.5" fill="#EB001B" />
    <circle cx="14.5" cy="7.5" r="4.5" fill="#F79E1B" fillOpacity="0.8" />
  </svg>
);

export default function PaymentMethodStep() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Expiry dates helper lists
  const currentYear = new Date().getFullYear();
  const months = useMemo(
    () => [
      { value: '', label: 'Month' },
      ...Array.from({ length: 12 }, (_, i) => {
        const val = String(i + 1).padStart(2, '0');
        return { value: val, label: val };
      }),
    ],
    [],
  );

  const years = useMemo(
    () => [
      { value: '', label: 'Year' },
      ...Array.from({ length: 12 }, (_, i) => {
        const val = String(currentYear + i);
        return { value: val, label: val };
      }),
    ],
    [currentYear],
  );

  const countries = useMemo(
    () => [
      'United States of America',
      'Canada',
      'United Kingdom',
      'Chile',
      'Australia',
      'Brazil',
      'Mexico',
      'Germany',
      'Japan',
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-frui-blue tracking-tight">
          Payment method
        </h1>
        <div className="flex gap-2 items-center mt-3">
          <MastercardIcon />
          <VisaIcon />
        </div>
      </div>

      {/* Name on Card */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">
          Name on Card <span className="text-red-500">*</span>
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

      {/* Card Number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">
          Debit/Credit card number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            placeholder="0000 0000 0000 0000"
            {...register('cardNumber', {
              onChange: (e) => {
                const rawVal = e.target.value
                  .replace(/\s+/g, '')
                  .replace(/[^0-9]/gi, '');
                const limitedVal = rawVal.substring(0, 16);

                // Group by 4 digits
                const parts = [];
                for (let i = 0; i < limitedVal.length; i += 4) {
                  parts.push(limitedVal.substring(i, i + 4));
                }

                setValue('cardNumber', parts.join(' '));
              },
            })}
            aria-invalid={!!errors.cardNumber}
            className="h-10 pr-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          <CreditCard className="absolute right-3 top-3 size-4 text-neutral-400" />
        </div>
        {errors.cardNumber && (
          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
            <ShieldAlert className="size-3 shrink-0" />
            {errors.cardNumber.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Expiry Date */}
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-bold text-frui-blue">
            Expiration date <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              {...register('cardExpiryMonth')}
              className="h-10 rounded-lg border border-neutral-300 px-2 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              {...register('cardExpiryYear')}
              className="h-10 rounded-lg border border-neutral-300 px-2 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
            >
              {years.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>
          {(errors.cardExpiryMonth || errors.cardExpiryYear) && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {
                (errors.cardExpiryMonth?.message ||
                  errors.cardExpiryYear?.message) as string
              }
            </span>
          )}
        </div>

        {/* CVV */}
        <div className="flex flex-col gap-1.5 col-span-1">
          <label className="text-xs font-bold text-frui-blue">
            Security code <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="CVV"
            {...register('cardCvv', {
              onChange: (e) => {
                const clean = e.target.value
                  .replace(/[^0-9]/g, '')
                  .substring(0, 4);
                setValue('cardCvv', clean);
              },
            })}
            aria-invalid={!!errors.cardCvv}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.cardCvv && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.cardCvv.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 my-1 pt-5 flex flex-col gap-5">
        {/* Country Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Country/Territory <span className="text-red-500">*</span>
          </label>
          <select
            {...register('billingCountry')}
            className="h-10 rounded-lg border border-neutral-300 px-3 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Address 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Billing address 1 <span className="text-red-500">*</span>
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
          <label className="text-xs font-bold text-frui-blue">
            City <span className="text-red-500">*</span>
          </label>
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
      </div>
    </div>
  );
}
