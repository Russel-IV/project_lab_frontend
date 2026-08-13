import { useFormContext } from 'react-hook-form';
import { useAppSelector } from '@/store/hooks';
import { Input } from '@/components/ui/input';
import { ShieldAlert } from 'lucide-react';
import { formatTravelers } from '@/utils/format';

export default function GuestDetailsStep() {
  const booking = useAppSelector((state) => state.booking);
  const resolvedTravelers = booking.travelers || '2 travelers, 1 room';

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-frui-blue tracking-tight">
          Who&apos;s checking in?
        </h1>
        <p className="text-xs text-neutral-400 mt-1">* Required</p>
      </div>

      <div className="bg-[#fcf8f5] rounded-xl p-3 border border-frui-orange/15 text-xs text-neutral-600">
        <span className="font-bold text-frui-blue">Property 1:</span>{' '}
        {formatTravelers(resolvedTravelers)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            First name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="(e.g. John)"
            autoComplete="off"
            {...register('firstName')}
            aria-invalid={!!errors.firstName}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.firstName && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.firstName.message as string}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Last name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="(e.g. Smith)"
            autoComplete="off"
            {...register('lastName')}
            aria-invalid={!!errors.lastName}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.lastName && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.lastName.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-frui-blue">
          Email address <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="(e.g. name@example.com)"
          type="email"
          autoComplete="off"
          {...register('email')}
          aria-invalid={!!errors.email}
          className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
        />
        {errors.email && (
          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
            <ShieldAlert className="size-3 shrink-0" />
            {errors.email.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5 col-span-1">
          <label className="text-xs font-bold text-frui-blue">
            Code <span className="text-red-500">*</span>
          </label>
          <select
            {...register('countryCode')}
            className="h-10 w-full rounded-lg border border-neutral-300 px-2 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
          >
            <option value="USA +1">USA +1</option>
            <option value="Canada +1">Canada +1</option>
            <option value="UK +44">UK +44</option>
            <option value="Chile +56">Chile +56</option>
            <option value="Australia +61">Aus +61</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-bold text-frui-blue">
            Phone number <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter phone number"
            type="tel"
            autoComplete="off"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.phone && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.phone.message as string}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
