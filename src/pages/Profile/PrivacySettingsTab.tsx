import type { BaseSyntheticEvent } from 'react';
import { useFormContext, FormProvider } from 'react-hook-form';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <section className="pb-8">
      <h2 className="text-lg font-semibold mb-4 text-frui-blue">
        Privacy Settings
      </h2>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-md"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Current password
          </label>
          <Input
            type="password"
            {...register('currentPassword')}
            aria-invalid={!!errors.currentPassword}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.currentPassword && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            New password
          </label>
          <Input
            type="password"
            {...register('newPassword')}
            aria-invalid={!!errors.newPassword}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.newPassword && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Confirm new password
          </label>
          <Input
            type="password"
            {...register('confirmNewPassword')}
            aria-invalid={!!errors.confirmNewPassword}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.confirmNewPassword && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
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
