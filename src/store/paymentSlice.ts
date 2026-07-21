import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface PaymentState {
  currentStep: number;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;

  cardName: string;
  billingCountry: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;

  // Desktop specific
  payWhen: 'now' | 'later';
}

const initialState: PaymentState = {
  currentStep: 1,
  firstName: '',
  lastName: '',
  email: '',
  countryCode: 'USA +1',
  phone: '',
  cardName: '',
  billingCountry: 'US',
  billingAddress1: '',
  billingAddress2: '',
  billingCity: '',
  payWhen: 'now',
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    updatePaymentField(
      state,
      action: PayloadAction<{
        field: keyof Omit<PaymentState, 'currentStep'>;
        value: unknown;
      }>,
    ) {
      const { field, value } = action.payload;
      (state as Record<string, unknown>)[field] = value;
    },
    updateAllPaymentFields(
      state,
      action: PayloadAction<Partial<Omit<PaymentState, 'currentStep'>>>,
    ) {
      Object.assign(state, action.payload);
    },
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    resetPaymentForm() {
      return initialState;
    },
  },
});

export const {
  updatePaymentField,
  updateAllPaymentFields,
  setStep,
  resetPaymentForm,
} = paymentSlice.actions;

export default paymentSlice.reducer;
