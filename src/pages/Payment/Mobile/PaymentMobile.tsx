import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setStep, updateAllPaymentFields } from '@/store/paymentSlice';
import { formatDatesRange } from '@/components/SearchForm/searchFormUtils';
import { formatPrice, formatTravelers } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Lock, Check, Building } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { type DateRange } from 'react-day-picker';
import type { GetStayDetailsQuery } from '@/types/__generated__/graphql';

import GuestDetailsStep from './GuestDetailsStep';
import PaymentMethodStep from './PaymentMethodStep';
import ConfirmationStep from './ConfirmationStep';

interface PaymentMobileProps {
  stay: GetStayDetailsQuery['stay'];
  dateRange: DateRange;
  resolvedCheckIn: string;
  resolvedCheckOut: string;
  resolvedTravelers: string;
  nights: number;
  pricePerNight: number;
  roomPriceTotal: number;
  serviceFee: number;
  totalPayable: number;
  bookingSuccess: boolean;
  setBookingSuccess: (success: boolean) => void;
  bookingRef: string;
  setBookingRef: (ref: string) => void;
}

export default function PaymentMobile({
  stay,
  dateRange,
  resolvedCheckIn,
  resolvedCheckOut,
  resolvedTravelers,
  nights,
  pricePerNight,
  roomPriceTotal,
  serviceFee,
  totalPayable,
  bookingSuccess,
  setBookingSuccess,
  bookingRef,
  setBookingRef,
}: PaymentMobileProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const paymentState = useAppSelector((state) => state.payment);
  const { currentStep } = paymentState;

  const { trigger, watch } = useFormContext();

  const handleContinue = async () => {
    if (currentStep === 1) {
      const isValid = await trigger([
        'firstName',
        'lastName',
        'email',
        'phone',
        'countryCode',
      ]);
      if (isValid) {
        const values = watch();
        dispatch(updateAllPaymentFields(values));
        dispatch(setStep(2));
      }
    } else if (currentStep === 2) {
      const isValid = await trigger([
        'cardName',
        'cardNumber',
        'cardExpiryMonth',
        'cardExpiryYear',
        'cardCvv',
        'billingCountry',
        'billingAddress1',
        'billingAddress2',
        'billingCity',
      ]);
      if (isValid) {
        const values = watch();
        dispatch(updateAllPaymentFields(values));
        dispatch(setStep(3));
      }
    } else if (currentStep === 3) {
      const randomRef = 'FRUI-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(randomRef);
      setBookingSuccess(true);
    }
  };

  const handleBack = () => {
    const values = watch();
    dispatch(updateAllPaymentFields(values));
    if (currentStep > 1) {
      dispatch(setStep(currentStep - 1));
    }
  };

  const steps = [
    { id: 1, label: 'Guest Details' },
    { id: 2, label: 'Payment' },
    { id: 3, label: 'Confirmation' },
  ];

  if (bookingSuccess) {
    return (
      <div className="w-full max-w-md bg-frui-white border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
        <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
          <Check className="size-8" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold text-frui-blue mb-1">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          Your stay at{' '}
          <span className="font-semibold text-frui-blue">
            {stay?.name || 'Beautiful Brand New Apartment'}
          </span>{' '}
          has been successfully reserved.
        </p>

        <div className="w-full border-t border-b border-border py-4 mb-6 flex flex-col gap-3 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Booking Reference</span>
            <span className="font-bold text-frui-blue uppercase">
              {bookingRef}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Dates</span>
            <span className="font-semibold text-neutral-800">
              {formatDatesRange(dateRange) ||
                `${resolvedCheckIn} - ${resolvedCheckOut}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Guests</span>
            <span className="font-semibold text-neutral-800">
              {formatTravelers(resolvedTravelers)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-dashed border-border/80">
            <span className="text-neutral-500 font-medium">Total Paid</span>
            <span className="font-bold text-frui-orange">
              {formatPrice(totalPayable)}
            </span>
          </div>
        </div>

        <div className="bg-[#f5f5f5] rounded-2xl p-4 text-xs text-neutral-600 mb-6 text-left flex gap-3 items-start leading-relaxed">
          <Building className="size-5 text-frui-blue shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-neutral-800 mb-0.5">
              Host notification sent
            </p>
            <p>
              The host has been notified of your booking details and will
              coordinate your check-in instructions.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="w-full bg-frui-blue text-frui-white font-bold h-12 rounded-xl border-0"
        >
          Go Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      {/* Wizard Steps indicator */}
      <div className="bg-frui-white border border-border rounded-2xl p-4 flex items-center justify-between select-none">
        {steps.map((s, idx) => (
          <Fragment key={s.id}>
            <div className="flex items-center gap-2">
              <div
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep === s.id
                    ? 'bg-frui-orange text-frui-white ring-4 ring-frui-orange/20'
                    : currentStep > s.id
                      ? 'bg-frui-blue text-frui-white'
                      : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {currentStep > s.id ? '✓' : s.id}
              </div>
              <span
                className={`text-xs font-semibold ${
                  currentStep === s.id
                    ? 'text-frui-blue font-bold'
                    : 'text-neutral-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                  currentStep > s.id ? 'bg-frui-blue' : 'bg-neutral-200'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Step Navigation Back Button */}
      {currentStep > 1 && (
        <button
          onClick={handleBack}
          className="self-start text-xs font-bold text-frui-blue flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
        >
          <ChevronLeft className="size-4" /> Back to previous step
        </button>
      )}

      {/* Wizard Card Containers */}
      <div className="bg-frui-white border border-border rounded-3xl p-6 shadow-xs flex flex-col gap-6">
        {currentStep === 1 && <GuestDetailsStep />}
        {currentStep === 2 && <PaymentMethodStep />}
        {currentStep === 3 && (
          <ConfirmationStep
            stay={stay}
            dateRange={dateRange}
            resolvedCheckIn={resolvedCheckIn}
            resolvedCheckOut={resolvedCheckOut}
            resolvedTravelers={resolvedTravelers}
            nights={nights}
            pricePerNight={pricePerNight}
            roomPriceTotal={roomPriceTotal}
            serviceFee={serviceFee}
            totalPayable={totalPayable}
          />
        )}

        {/* Action buttons */}
        <div className="border-t border-neutral-100 pt-4 flex flex-col gap-3">
          <Button
            onClick={handleContinue}
            className="w-full bg-frui-orange text-frui-white font-bold h-12 rounded-xl text-sm border-0 select-none cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            {currentStep === 3 ? (
              <>
                <Lock className="size-4 shrink-0" />
                <span>Complete Booking</span>
              </>
            ) : (
              'Continue'
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
            <Lock className="size-3" />
            <span>Secure Checkout SSL encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
