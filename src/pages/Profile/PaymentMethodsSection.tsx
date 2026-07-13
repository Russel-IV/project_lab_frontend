import { type BaseSyntheticEvent, useMemo, Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldAlert, CreditCard } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { formatMaskedCard } from '@/utils/format';
import type { PaymentMethodResponse } from '@/api/profile';
import type { PaymentMethodFormValues } from './profileSchema';

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethodResponse[];
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  onSetDefault: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  actionError: string | null;
}

export function PaymentMethodsSection({
  paymentMethods,
  onSubmit,
  onSetDefault,
  onRemove,
  actionError,
}: PaymentMethodsSectionProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<PaymentMethodFormValues>();

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

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Cards saved to your account for faster checkout.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="flex flex-col">
              {paymentMethods.map((pm, i) => (
                <Fragment key={pm.id}>
                  {i > 0 && <div className="border-t border-border" />}
                  <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <CreditCard className="size-6 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {pm.brand} {formatMaskedCard(pm.lastFour)}
                        </p>
                        {pm.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Expires {String(pm.expiryMonth).padStart(2, '0')}/
                        {pm.expiryYear}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!pm.isDefault && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => onSetDefault(pm.id)}
                        >
                          Set as primary
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                            >
                              Remove
                            </Button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove this payment method?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This can&apos;t be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onRemove(pm.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No payment methods saved yet.
            </p>
          )}

          {actionError && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-4">
              <ShieldAlert className="size-3.5 shrink-0" />
              {actionError}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Add a payment method</CardTitle>
        </CardHeader>

        <form onSubmit={onSubmit} noValidate className="contents">
          <CardContent className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Name on card
              </label>
              <Input
                {...register('cardholderName')}
                aria-invalid={!!errors.cardholderName}
                className="h-10"
              />
              {errors.cardholderName && (
                <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                  <ShieldAlert className="size-3 shrink-0" />
                  {errors.cardholderName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Card number
              </label>
              <Input
                placeholder="0000 0000 0000 0000"
                {...register('cardNumber')}
                aria-invalid={!!errors.cardNumber}
                className="h-10"
              />
              {errors.cardNumber && (
                <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                  <ShieldAlert className="size-3 shrink-0" />
                  {errors.cardNumber.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Expiration date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    {...register('expiryMonth')}
                    className="h-10 rounded-lg border border-input px-2 py-1 text-sm bg-transparent outline-none focus:border-ring"
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    {...register('expiryYear')}
                    className="h-10 rounded-lg border border-input px-2 py-1 text-sm bg-transparent outline-none focus:border-ring"
                  >
                    {years.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>
                {(errors.expiryMonth || errors.expiryYear) && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                    <ShieldAlert className="size-3 shrink-0" />
                    {errors.expiryMonth?.message || errors.expiryYear?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="text-sm font-medium text-foreground">
                  CVV
                </label>
                <Input
                  {...register('cvv')}
                  aria-invalid={!!errors.cvv}
                  className="h-10"
                />
                {errors.cvv && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                    <ShieldAlert className="size-3 shrink-0" />
                    {errors.cvv.message}
                  </span>
                )}
              </div>
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
    </>
  );
}

export default PaymentMethodsSection;
