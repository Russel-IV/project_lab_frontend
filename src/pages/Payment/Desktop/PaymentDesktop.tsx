import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { updateAllPaymentFields } from '@/store/paymentSlice';
import { formatDatesRange } from '@/components/SearchForm/searchFormUtils';
import { formatPrice, formatTravelers } from '@/utils/format';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  Building,
} from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import type { GetStayDetailsQuery } from '@/types/__generated__/graphql';

import ChooseWhenToPaySection from './ChooseWhenToPaySection';
import GuestDetailsSection from './GuestDetailsSection';
import PaymentElementForm from '../PaymentElementForm';

interface PaymentDesktopProps {
  stay: GetStayDetailsQuery['stay'];
  dateRange: DateRange;
  resolvedCheckIn: string;
  resolvedCheckOut: string;
  resolvedTravelers: string;
  nights: number;
  pricePerNight: number;
  roomPriceTotal: number;
  roomCount: number;
  serviceFee: number;
  totalPayable: number;
  bookingSuccess: boolean;
  bookingRef: string;
  submitBooking: () => Promise<boolean>;
  bookingSubmitting: boolean;
  bookingError: string | null;
}

export default function PaymentDesktop({
  stay,
  dateRange,
  resolvedCheckIn,
  resolvedCheckOut,
  resolvedTravelers,
  nights,
  pricePerNight,
  roomPriceTotal,
  roomCount,
  serviceFee,
  totalPayable,
  bookingSuccess,
  bookingRef,
  submitBooking,
  bookingSubmitting,
  bookingError,
}: PaymentDesktopProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Accordion active sections
  const [activeSection, setActiveSection] = useState<
    'payTiming' | 'guestInfo' | 'paymentMethod'
  >('payTiming');

  const {
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValues = watch();

  // Format date cancellation limit
  const formattedCancelDate = useMemo(() => {
    try {
      const date = new Date(resolvedCheckIn);
      date.setDate(date.getDate() - 3);
      return format(date, 'MMMM d, yyyy');
    } catch {
      return '3 days prior to check-in';
    }
  }, [resolvedCheckIn]);

  // Submit booking handler
  const handleSubmitBooking = async () => {
    const isValid = await trigger();
    if (isValid) {
      const values = watch();
      dispatch(updateAllPaymentFields(values));

      await submitBooking();
    } else {
      // Auto expand sections containing error states
      if (errors.firstName || errors.lastName || errors.email || errors.phone) {
        setActiveSection('guestInfo');
      } else if (
        errors.cardName ||
        errors.billingAddress1 ||
        errors.billingCity ||
        errors.billingState ||
        errors.billingPostalCode
      ) {
        setActiveSection('paymentMethod');
      }
    }
  };

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
          variant="secondary"
          onClick={() => navigate('/')}
          className="w-full font-bold h-12 rounded-xl"
        >
          Go Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Back Button Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/stay/${stay?.id}`)}
          className="size-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 bg-frui-white hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="text-3xl font-bold text-frui-blue tracking-tight">
          Request a booking
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: STAY DETAILS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-frui-white border border-border rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            {/* Stay Recap card */}
            <div className="flex gap-4 items-start">
              {stay?.pictures && stay.pictures.length > 0 && (
                <img
                  src={stay.pictures[0].url}
                  alt={stay.name}
                  className="size-24 rounded-2xl object-cover shrink-0 border border-neutral-100"
                />
              )}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-neutral-500 font-medium">
                  Entire rental unit
                </span>
                <h3 className="font-bold text-sm text-frui-blue leading-snug">
                  {stay?.name || 'Beautiful Brand New Apartment'}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="size-3.5 fill-frui-orange stroke-frui-orange shrink-0" />
                  <span className="text-xs font-bold text-frui-blue">
                    {stay?.starRating || 4.8} Stars
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation Details */}
            <div className="border-t border-border pt-4 flex flex-col gap-1 text-xs">
              <span className="font-bold text-frui-blue">
                Free cancellation
              </span>
              <p className="text-neutral-500 leading-relaxed">
                If you cancel before {formattedCancelDate}, you&apos;ll receive
                a full refund.
              </p>
            </div>

            {/* Editable summary fields */}
            <div className="border-t border-border pt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-frui-blue block">Dates</span>
                  <span className="text-neutral-500 mt-0.5 block">
                    {formatDatesRange(dateRange) ||
                      `${resolvedCheckIn} - ${resolvedCheckOut}`}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/stay/${stay?.id}`)}
                  className="text-xs"
                >
                  Change
                </Button>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-dashed border-border pt-4">
                <div>
                  <span className="font-bold text-frui-blue block">Guests</span>
                  <span className="text-neutral-500 mt-0.5 block">
                    {formatTravelers(resolvedTravelers)}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/stay/${stay?.id}`)}
                  className="text-xs"
                >
                  Change
                </Button>
              </div>
            </div>

            {/* Price Details */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <h3 className="font-bold text-sm text-frui-blue">
                Price details
              </h3>
              <div className="flex flex-col gap-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>
                    {roomCount} {roomCount === 1 ? 'room' : 'rooms'} x {nights}{' '}
                    nights
                  </span>
                  <span>{formatPrice(roomPriceTotal)}</span>
                </div>
                <div className="text-[10px] text-neutral-400 -mt-1 font-medium">
                  {formatPrice(pricePerNight)} average per night
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-frui-blue border-t border-border pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-base text-frui-orange">
                    {formatPrice(totalPayable)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACCORDION FORM */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* 1. CHOOSE WHEN TO PAY ACCORDION */}
          <div className="bg-frui-white border border-border rounded-2xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  activeSection === 'payTiming' ? 'guestInfo' : 'payTiming',
                )
              }
              className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-frui-blue hover:bg-neutral-50/50 cursor-pointer"
            >
              <span>1. Choose when to pay</span>
              {activeSection === 'payTiming' ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>

            {activeSection === 'payTiming' && (
              <ChooseWhenToPaySection
                totalPayable={totalPayable}
                formattedCancelDate={formattedCancelDate}
              />
            )}
          </div>

          {/* 2. WHO'S CHECKING IN? ACCORDION */}
          <div className="bg-frui-white border border-border rounded-2xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  activeSection === 'guestInfo' ? 'paymentMethod' : 'guestInfo',
                )
              }
              className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-frui-blue hover:bg-neutral-50/50 cursor-pointer"
            >
              <div className="flex gap-2 items-center">
                <span>2. Who&apos;s checking in?</span>
                {!(
                  errors.firstName ||
                  errors.lastName ||
                  errors.email ||
                  errors.phone
                ) &&
                  currentValues.firstName && (
                    <Check className="size-4 text-emerald-600" />
                  )}
              </div>
              {activeSection === 'guestInfo' ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>

            {activeSection === 'guestInfo' && <GuestDetailsSection />}
          </div>

          {/* 3. PAYMENT METHOD ACCORDION */}
          <div className="bg-frui-white border border-border rounded-2xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  activeSection === 'paymentMethod'
                    ? 'payTiming'
                    : 'paymentMethod',
                )
              }
              className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-frui-blue hover:bg-neutral-50/50 cursor-pointer"
            >
              <div className="flex gap-2 items-center">
                <span>3. Payment method</span>
              </div>
              {activeSection === 'paymentMethod' ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>

            {activeSection === 'paymentMethod' && (
              <PaymentElementForm variant="desktop" />
            )}
          </div>

          {/* Submit block */}
          <div className="border-t border-neutral-200 mt-2 pt-6 flex flex-col gap-4">
            <p className="text-xs text-center text-neutral-500 leading-relaxed">
              The host has 24 hours to confirm your reservation. You won&apos;t
              be charged until the host accepts your request.
            </p>

            {bookingError && (
              <p className="text-xs text-center text-destructive leading-relaxed">
                {bookingError}
              </p>
            )}

            <Button
              onClick={handleSubmitBooking}
              disabled={bookingSubmitting}
              className="w-full font-bold h-12 rounded-xl text-sm select-none flex items-center justify-center gap-1.5 uppercase tracking-wide"
            >
              {bookingSubmitting ? 'Requesting…' : 'Request booking'}
            </Button>

            <p className="text-[10.5px] text-center text-neutral-500 leading-relaxed">
              By selecting the button, I agree to the{' '}
              <span className="underline cursor-pointer text-frui-blue font-semibold">
                booking terms
              </span>{' '}
              and the{' '}
              <span className="underline cursor-pointer text-frui-blue font-semibold">
                updated Terms of Service
              </span>
              . Consult the{' '}
              <span className="underline cursor-pointer text-frui-blue font-semibold">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
