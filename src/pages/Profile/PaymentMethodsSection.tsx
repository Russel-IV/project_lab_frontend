import { type BaseSyntheticEvent, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldAlert, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <section className="border-b pb-8">
      <h2 className="text-lg font-semibold mb-4 text-frui-blue">
        Payment Methods
      </h2>

      {paymentMethods.length > 0 ? (
        <div className="flex flex-col gap-3 mb-6 max-w-md">
          {paymentMethods.map((pm) => (
            <Card key={pm.id} className="flex-row items-center gap-4 p-4">
              <CreditCard className="size-6 text-frui-blue shrink-0" />
              <CardContent className="flex-1 px-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {pm.brand} {formatMaskedCard(pm.lastFour)}
                  </p>
                  {pm.isDefault && <Badge variant="outline">Default</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Expires {String(pm.expiryMonth).padStart(2, '0')}/
                  {pm.expiryYear}
                </p>
              </CardContent>
              <div className="flex items-center gap-2 shrink-0">
                {!pm.isDefault && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSetDefault(pm.id)}
                  >
                    Set as primary
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button type="button" variant="destructive" size="sm">
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
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          No payment methods saved yet.
        </p>
      )}

      {actionError && (
        <p className="text-xs text-destructive font-medium flex items-center gap-1 mb-6">
          <ShieldAlert className="size-3.5 shrink-0" />
          {actionError}
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-md"
        noValidate
      >
        <h3 className="text-sm font-semibold text-foreground">
          Add a payment method
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Name on card
          </label>
          <Input
            {...register('cardholderName')}
            aria-invalid={!!errors.cardholderName}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.cardholderName && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.cardholderName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">
            Card number
          </label>
          <Input
            placeholder="0000 0000 0000 0000"
            {...register('cardNumber')}
            aria-invalid={!!errors.cardNumber}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.cardNumber && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
              <ShieldAlert className="size-3 shrink-0" />
              {errors.cardNumber.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-xs font-bold text-frui-blue">
              Expiration date
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                {...register('expiryMonth')}
                className="h-10 rounded-lg border border-neutral-300 px-2 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                {...register('expiryYear')}
                className="h-10 rounded-lg border border-neutral-300 px-2 py-1 text-sm bg-transparent outline-none focus:border-frui-orange"
              >
                {years.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>
            {(errors.expiryMonth || errors.expiryYear) && (
              <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.expiryMonth?.message || errors.expiryYear?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 col-span-1">
            <label className="text-xs font-bold text-frui-blue">CVV</label>
            <Input
              {...register('cvv')}
              aria-invalid={!!errors.cvv}
              className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
            />
            {errors.cvv && (
              <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
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

export default PaymentMethodsSection;
