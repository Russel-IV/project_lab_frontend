import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { resetPassword, ResetPasswordValidationError } from '@/api/auth';
import { Seo } from '@/lib/seo';

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [linkError, setLinkError] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ newPassword }: ResetPasswordFormValues) => {
    if (!token) return;
    try {
      await resetPassword(token, newPassword);
      navigate('/login');
    } catch (err) {
      if (err instanceof ResetPasswordValidationError) {
        if (err.errors.newPassword) {
          setError('newPassword', { message: err.errors.newPassword });
        }
        return;
      }
      if (
        err instanceof Error &&
        err.message.includes('invalid or has expired')
      ) {
        setLinkError(true);
        return;
      }
      setError('root', {
        message:
          err instanceof Error ? err.message : 'Failed to reset password.',
      });
    }
  };

  const showInvalidLink = !token || linkError;

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#fff8f3] pt-[80px] pb-[300px]">
      <Seo title="Reset Password" path="/reset-password" noIndex />
      <section className="w-full max-w-sm px-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>Choose a new password below.</CardDescription>
          </CardHeader>

          {showInvalidLink ? (
            <CardContent className="flex flex-col gap-3">
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                This link is invalid or has expired.
              </span>
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground underline"
              >
                Request a new link
              </Link>
            </CardContent>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="contents"
            >
              <CardContent className="flex flex-col gap-4">
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
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Reset password'}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </section>
    </div>
  );
}
