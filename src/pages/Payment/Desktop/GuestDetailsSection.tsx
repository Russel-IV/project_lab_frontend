import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { ShieldAlert } from 'lucide-react';

export default function GuestDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="px-6 pb-6 border-t border-neutral-100 pt-5 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            First name *
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
            Last name *
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
          Email address *
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
          <label className="text-xs font-bold text-frui-blue">Code *</label>
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
            Phone number *
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
