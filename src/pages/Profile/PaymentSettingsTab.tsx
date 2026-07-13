import { FormProvider } from 'react-hook-form';
import { useAccountSettingsContext } from './AccountSettingsContext';
import { PaymentMethodsSection } from './PaymentMethodsSection';

export function PaymentSettingsTab() {
  const {
    paymentMethods,
    paymentMethodForm,
    handleAddPaymentMethod,
    handleSetDefaultPaymentMethod,
    handleDeletePaymentMethod,
    paymentMethodActionError,
  } = useAccountSettingsContext();

  return (
    <FormProvider {...paymentMethodForm}>
      <PaymentMethodsSection
        paymentMethods={paymentMethods}
        onSubmit={paymentMethodForm.handleSubmit(handleAddPaymentMethod)}
        onSetDefault={handleSetDefaultPaymentMethod}
        onRemove={handleDeletePaymentMethod}
        actionError={paymentMethodActionError}
      />
    </FormProvider>
  );
}

export default PaymentSettingsTab;
