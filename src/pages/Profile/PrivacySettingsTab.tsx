import type { BaseSyntheticEvent } from 'react';
import { useFormContext, FormProvider } from 'react-hook-form';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
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
import { useAccountSettingsContext } from './AccountSettingsContext';
import type { ChangePasswordFormValues } from './profileSchema';

interface ChangePasswordSectionProps {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  passwordChangeSuccess: boolean;
}

function ChangePasswordSection({
  onSubmit,
  passwordChangeSuccess,
}: ChangePasswordSectionProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<ChangePasswordFormValues>();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          You&apos;ll need to confirm your current password to set a new one.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate className="contents">
        <CardContent className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Current password
            </label>
            <Input
              type="password"
              {...register('currentPassword')}
              aria-invalid={!!errors.currentPassword}
              className="h-10"
            />
            {errors.currentPassword && (
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              New password
            </label>
            <Input
              type="password"
              {...register('newPassword')}
              aria-invalid={!!errors.newPassword}
              className="h-10"
            />
            {errors.newPassword && (
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Confirm new password
            </label>
            <Input
              type="password"
              {...register('confirmNewPassword')}
              aria-invalid={!!errors.confirmNewPassword}
              className="h-10"
            />
            {errors.confirmNewPassword && (
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.confirmNewPassword.message}
              </span>
            )}
          </div>

          {errors.root && (
            <span className="text-xs text-destructive font-medium flex items-center gap-1">
              <ShieldAlert className="size-3.5 shrink-0" />
              {errors.root.message}
            </span>
          )}

          {passwordChangeSuccess && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3.5 shrink-0" />
              Your password has been changed.
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

export function PrivacySettingsTab() {
  const { changePasswordForm, handleChangePassword, passwordChangeSuccess } =
    useAccountSettingsContext();

  return (
    <FormProvider {...changePasswordForm}>
      <ChangePasswordSection
        onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
        passwordChangeSuccess={passwordChangeSuccess}
      />
    </FormProvider>
  );
}

export default PrivacySettingsTab;
