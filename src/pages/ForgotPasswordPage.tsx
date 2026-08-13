import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { requestPasswordReset } from '@/api/auth';
import { Seo } from '@/lib/seo';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    // Always show the same outcome regardless of whether the email exists —
    // the backend already returns the same response either way, so there is
    // nothing to branch on here without leaking which accounts are real.
    try {
      await requestPasswordReset(email);
    } catch {
      // ignored — still show the generic confirmation below
    }
    setSubmitted(true);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#fff8f3] pt-[80px] pb-[300px]">
      <Seo title="Forgot Password" path="/forgot-password" noIndex />
      <section className="w-full max-w-sm px-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a link to reset it.
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent>
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3.5 shrink-0" />
                If an account exists for that email, we&apos;ve sent a password
                reset link.
              </span>
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
                    Email
                  </label>
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
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send reset link'}
                </Button>
                <Link
                  to="/login"
                  className="text-center text-sm text-muted-foreground underline"
                >
                  Back to log in
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </section>
    </div>
  );
}
