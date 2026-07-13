import type { BaseSyntheticEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Used for booking confirmations and account recovery.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate className="contents">
        <CardContent className="flex flex-col gap-6 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              className="h-10"
            />
            {errors.email && (
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Phone number
            </label>
            <Input
              type="tel"
              {...register('phone')}
              aria-invalid={!!errors.phone}
              className="h-10"
            />
            {errors.phone && (
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              value="••••••••"
              disabled
              readOnly
              aria-label="Password (hidden)"
              className="h-10 tracking-widest"
            />
            <p className="text-xs text-muted-foreground">
              Managed under Privacy Settings.
            </p>
          </div>

          {errors.root && (
            <span className="text-xs text-destructive font-medium flex items-center gap-1">
              <ShieldAlert className="size-3.5 shrink-0" />
              {errors.root.message}
            </span>
          )}
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default PersonalInfoSection;
