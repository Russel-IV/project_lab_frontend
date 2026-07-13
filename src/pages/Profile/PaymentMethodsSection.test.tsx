import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentMethodsSection } from './PaymentMethodsSection';
import {
  paymentMethodSchema,
  type PaymentMethodFormValues,
} from './profileSchema';
import type { PaymentMethodResponse } from '@/api/profile';

const emptyValues: PaymentMethodFormValues = {
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
};

function paymentMethod(
  overrides: Partial<PaymentMethodResponse> = {},
): PaymentMethodResponse {
  return {
    id: 1,
    stripePaymentMethodId: 'pm_1',
    brand: 'Visa',
    lastFour: '4242',
    type: 'card',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 5,
    isDefault: false,
    ...overrides,
  };
}

function Wrapper({
  paymentMethods,
  onSetDefault,
  onRemove,
}: {
  paymentMethods: PaymentMethodResponse[];
  onSetDefault: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: emptyValues,
  });

  return (
    <FormProvider {...form}>
      <PaymentMethodsSection
        paymentMethods={paymentMethods}
        onSubmit={form.handleSubmit(async () => {})}
        onSetDefault={onSetDefault}
        onRemove={onRemove}
        actionError={null}
      />
    </FormProvider>
  );
}

describe('PaymentMethodsSection', () => {
  it('calls onSetDefault with the right id when "Set as primary" is clicked', async () => {
    const user = userEvent.setup();
    const onSetDefault = vi.fn().mockResolvedValue(undefined);
    render(
      <Wrapper
        paymentMethods={[paymentMethod({ id: 7 })]}
        onSetDefault={onSetDefault}
        onRemove={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Set as primary' }));
    expect(onSetDefault).toHaveBeenCalledWith(7);
  });

  it('does not show "Set as primary" for the default payment method, and badges it', () => {
    render(
      <Wrapper
        paymentMethods={[paymentMethod({ id: 7, isDefault: true })]}
        onSetDefault={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Set as primary' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('gates deletion behind the confirm dialog: clicking Cancel does not call onRemove', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn().mockResolvedValue(undefined);
    render(
      <Wrapper
        paymentMethods={[paymentMethod({ id: 9 })]}
        onSetDefault={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(onRemove).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('calls onRemove with the right id when the confirm dialog is confirmed', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn().mockResolvedValue(undefined);
    render(
      <Wrapper
        paymentMethods={[paymentMethod({ id: 9 })]}
        onSetDefault={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledWith(9);
  });
});
