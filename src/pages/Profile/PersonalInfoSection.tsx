import type { BaseSyntheticEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PersonalInfoFormValues } from './profileSchema';

interface PersonalInfoSectionProps {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function PersonalInfoSection({ onSubmit }: PersonalInfoSectionProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<PersonalInfoFormValues>();

  return (
    <section className="border-b pb-8">
      <h2 className="text-lg font-semibold mb-4 text-frui-blue">
        Personal Information
      </h2>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-md"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">Email</label>
          <Input
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.email && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Phone number
          </label>
          <Input
            type="tel"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.phone && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">Password</label>
          <Input
            type="password"
            value="••••••••"
            disabled
            readOnly
            aria-label="Password (hidden)"
            className="h-10 border-neutral-300 tracking-widest"
          />
        </div>

        {errors.root && (
          <span className="text-xs text-destructive font-medium flex items-center gap-1">
            <ShieldAlert className="size-3.5 shrink-0" />
            {errors.root.message}
          </span>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="self-start bg-frui-orange text-frui-white border-0"
        >
          {isSubmitting ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </section>
  );
}

export default PersonalInfoSection;
