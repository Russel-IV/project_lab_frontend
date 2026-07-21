import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { GET_STAY_DETAILS } from '@/graphql/stays';
import { CREATE_BOOKING } from '@/graphql/bookings';
import { CREATE_PAYMENT_INTENT } from '@/graphql/paymentIntents';
import type {
  GetStayDetailsQuery,
  GetStayDetailsQueryVariables,
  CreateBookingMutation,
  CreateBookingMutationVariables,
  CreatePaymentIntentMutation,
  CreatePaymentIntentMutationVariables,
} from '@/types/__generated__/graphql';
import { resetPaymentForm } from '@/store/paymentSlice';
import { clearRoomSelection } from '@/store/bookingSlice';
import {
  parseISOToDateRange,
  getTotalGuests,
} from '@/components/SearchForm/searchFormUtils';
import { calculateNights } from '@/utils/date';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Button } from '@/components/ui/button';
import { format, startOfDay } from 'date-fns';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { type DateRange } from 'react-day-picker';

import { stripePromise } from '@/lib/stripe';
import { STRIPE_CHECKOUT_ENABLED } from '@/config/features';
import PaymentMobile from './Mobile/PaymentMobile';
import PaymentDesktop from './Desktop/PaymentDesktop';
import { paymentSchema, type PaymentFormValues } from './Schemas/paymentSchema';
import { Seo } from '@/lib/seo';

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Booking details from store
  const booking = useAppSelector((state) => state.booking);

  // Fallbacks for stay checking dates
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return format(startOfDay(d), 'yyyy-MM-dd');
  }, []);
  const dayAfterTomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return format(startOfDay(d), 'yyyy-MM-dd');
  }, []);

  const resolvedCheckIn = booking.checkIn || tomorrowStr;
  const resolvedCheckOut = booking.checkOut || dayAfterTomorrowStr;
  const resolvedTravelers = booking.travelers || '2 travelers, 1 room';

  // Stay info fetching
  const stayId = id ? parseInt(id, 10) : NaN;
  const { data, loading, error } = useQuery<
    GetStayDetailsQuery,
    GetStayDetailsQueryVariables
  >(GET_STAY_DETAILS, {
    variables: { id: stayId },
    skip: Number.isNaN(stayId),
  });

  const stay = data?.stay ?? null;

  // Night and price calculations
  const dateRange = useMemo(
    () => parseISOToDateRange(resolvedCheckIn, resolvedCheckOut),
    [resolvedCheckIn, resolvedCheckOut],
  );
  const nights = useMemo(() => calculateNights(dateRange), [dateRange]);

  const selectedRoomsNightly = booking.selectedRooms.reduce(
    (sum, room) => sum + room.price,
    0,
  );
  const pricePerNight =
    selectedRoomsNightly || (stay?.startingFromPrice as number) || 120000;
  const roomPriceTotal = pricePerNight * nights;
  const serviceFee = Math.round(roomPriceTotal * 0.1375);
  const totalPayable = roomPriceTotal + serviceFee;
  const roomCount = booking.selectedRooms.length || 1;

  if (loading) {
    return (
      <div className="flex-1 w-full bg-frui-cream flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        <Seo title="Payment" path={`/payment/${id ?? ''}`} noIndex />
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-6 w-48 bg-neutral-200 rounded" />
          <div className="h-4 w-64 bg-neutral-200 rounded" />
          <div className="h-40 w-80 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || (id && !stay)) {
    return (
      <div className="flex-1 w-full bg-frui-cream flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[500px]">
        <Seo title="Payment" path={`/payment/${id ?? ''}`} noIndex />
        <h1 className="text-xl font-bold text-frui-blue">Stay not found</h1>
        <p className="text-sm text-neutral-500 max-w-md">
          {error?.message || "We couldn't find the stay you are looking for."}
        </p>
        <Button
          onClick={() => navigate('/stays')}
          className="font-bold h-10 px-6 rounded-xl"
        >
          Back to Stays
        </Button>
      </div>
    );
  }

  if (!STRIPE_CHECKOUT_ENABLED) {
    return (
      <div className="flex-1 w-full bg-frui-cream flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[500px]">
        <Seo title="Payment" path={`/payment/${id ?? ''}`} noIndex />
        <h1 className="text-xl font-bold text-frui-blue">
          Checkout unavailable
        </h1>
        <p className="text-sm text-neutral-500 max-w-md">
          Payments aren&apos;t configured for this environment. Set{' '}
          <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
            VITE_STRIPE_PUBLISHABLE_KEY
          </code>{' '}
          to enable checkout.
        </p>
        <Button
          onClick={() => navigate(`/stay/${stay?.id ?? ''}`)}
          className="font-bold h-10 px-6 rounded-xl"
        >
          Back to Stay
        </Button>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        // totalPayable is a decimal dollar amount (e.g. 137.5 => $137.50);
        // Stripe's `amount` wants an integer in the currency's smallest
        // unit (cents for USD). This is only the Element's initial display
        // estimate — the real charge amount is computed server-side.
        amount: Math.round(totalPayable * 100),
        currency: 'usd',
        // Restrict to card only, matching the backend contract's scope
        // (payment_method_types: ['card']) — without this, Elements falls
        // back to the Stripe account's automatic payment methods (Klarna,
        // Cash App Pay, etc.), which require confirmParams.return_url for
        // their redirect-based flows we don't support yet.
        paymentMethodTypes: ['card'],
      }}
    >
      <PaymentCheckout
        id={id}
        stay={stay}
        isMobile={isMobile}
        dateRange={dateRange}
        resolvedCheckIn={resolvedCheckIn}
        resolvedCheckOut={resolvedCheckOut}
        resolvedTravelers={resolvedTravelers}
        nights={nights}
        pricePerNight={pricePerNight}
        roomPriceTotal={roomPriceTotal}
        roomCount={roomCount}
        serviceFee={serviceFee}
        totalPayable={totalPayable}
      />
    </Elements>
  );
}

interface PaymentCheckoutProps {
  id: string | undefined;
  stay: GetStayDetailsQuery['stay'];
  isMobile: boolean;
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
}

// Split out from Payment() because useStripe()/useElements() only work
// inside the <Elements> tree, which itself needs totalPayable computed
// above it — so this owns the form/submit half of the checkout page.
function PaymentCheckout({
  id,
  stay,
  isMobile,
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
}: PaymentCheckoutProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const selectedRooms = useAppSelector((state) => state.booking.selectedRooms);
  const paymentState = useAppSelector((state) => state.payment);
  const authToken = useAppSelector((state) => state.auth.token);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Persists across retries within this checkout attempt so a retried
  // submitBooking() call reuses the same payment intent instead of
  // charging twice.
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const [createBookingMutation] = useMutation<
    CreateBookingMutation,
    CreateBookingMutationVariables
  >(CREATE_BOOKING);
  const [createPaymentIntentMutation] = useMutation<
    CreatePaymentIntentMutation,
    CreatePaymentIntentMutationVariables
  >(CREATE_PAYMENT_INTENT);

  // Submits the actual booking to the backend: validates the Payment
  // Element, creates a PaymentIntent for the current selection, confirms
  // the charge with Stripe, then creates the booking referencing the
  // confirmed intent. Returns whether it succeeded so the Desktop/Mobile
  // submit flows can decide whether to advance to the confirmation view.
  const submitBooking = async (): Promise<boolean> => {
    setBookingError(null);

    if (!authToken) {
      navigate('/login');
      return false;
    }
    if (selectedRooms.length === 0) {
      setBookingError('Please select a room before completing your booking.');
      return false;
    }
    if (!stripe || !elements) {
      setBookingError(
        'Payment form is still loading. Please try again in a moment.',
      );
      return false;
    }

    setSubmitting(true);
    try {
      const { error: elementsError } = await elements.submit();
      if (elementsError) {
        setBookingError(
          elementsError.message ?? 'Please check your card details.',
        );
        return false;
      }

      const guestsCount = getTotalGuests(resolvedTravelers) || 1;
      const roomIds = selectedRooms.map((room) => room.id);

      const intentResult = await createPaymentIntentMutation({
        variables: {
          input: {
            roomIds,
            checkInDate: resolvedCheckIn,
            checkOutDate: resolvedCheckOut,
            guestsCount,
            idempotencyKey,
          },
        },
      });
      const intent = intentResult.data?.createPaymentIntent;
      if (!intent) {
        setBookingError(
          'Something went wrong preparing your payment. Please try again.',
        );
        return false;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          clientSecret: intent.clientSecret,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: paymentState.cardName,
                address: {
                  country: paymentState.billingCountry,
                  line1: paymentState.billingAddress1,
                  line2: paymentState.billingAddress2 || undefined,
                  city: paymentState.billingCity,
                  state: paymentState.billingState,
                  postal_code: paymentState.billingPostalCode,
                },
              },
            },
          },
          redirect: 'if_required',
        });

      if (confirmError) {
        setBookingError(
          `Payment failed: ${confirmError.message ?? 'please try a different card.'}`,
        );
        return false;
      }
      if (paymentIntent?.status !== 'succeeded') {
        setBookingError('Payment could not be completed. Please try again.');
        return false;
      }

      const result = await createBookingMutation({
        variables: {
          input: {
            checkInDate: resolvedCheckIn,
            checkOutDate: resolvedCheckOut,
            guestsCount,
            roomIds,
            paymentIntentId: intent.paymentIntentId,
          },
        },
      });
      const created = result.data?.createBooking;
      if (!created) {
        setBookingError(
          `Your payment succeeded, but something went wrong creating your booking. Please contact support with reference ${intent.paymentIntentId}.`,
        );
        return false;
      }
      setBookingRef(`FRUI-${created.id}`);
      setBookingSuccess(true);
      dispatch(clearRoomSelection());
      return true;
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : 'Something went wrong creating your booking. Please try again.',
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // React Hook Form initialization
  const methods = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      firstName: paymentState.firstName,
      lastName: paymentState.lastName,
      email: paymentState.email,
      countryCode: paymentState.countryCode,
      phone: paymentState.phone,
      cardName: paymentState.cardName,
      billingCountry: paymentState.billingCountry,
      billingAddress1: paymentState.billingAddress1,
      billingAddress2: paymentState.billingAddress2,
      billingCity: paymentState.billingCity,
      billingState: paymentState.billingState,
      billingPostalCode: paymentState.billingPostalCode,
      payWhen: paymentState.payWhen,
    },
  });

  const { reset } = methods;

  // Reset form on mount
  useEffect(() => {
    dispatch(resetPaymentForm());
    reset({
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
      billingState: '',
      billingPostalCode: '',
      payWhen: 'now',
    });
  }, [dispatch, reset]);

  return (
    <FormProvider {...methods}>
      <div className="flex-1 w-full bg-frui-cream">
        <Seo title="Payment" path={`/payment/${id ?? ''}`} noIndex />
        {isMobile ? (
          <div className="py-6 px-4 flex flex-col items-center">
            <PaymentMobile
              stay={stay}
              dateRange={dateRange}
              resolvedCheckIn={resolvedCheckIn}
              resolvedCheckOut={resolvedCheckOut}
              resolvedTravelers={resolvedTravelers}
              nights={nights}
              pricePerNight={pricePerNight}
              roomPriceTotal={roomPriceTotal}
              roomCount={roomCount}
              serviceFee={serviceFee}
              totalPayable={totalPayable}
              bookingSuccess={bookingSuccess}
              bookingRef={bookingRef}
              submitBooking={submitBooking}
              bookingSubmitting={submitting}
              bookingError={bookingError}
            />
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center">
            <PaymentDesktop
              stay={stay}
              dateRange={dateRange}
              resolvedCheckIn={resolvedCheckIn}
              resolvedCheckOut={resolvedCheckOut}
              resolvedTravelers={resolvedTravelers}
              nights={nights}
              pricePerNight={pricePerNight}
              roomPriceTotal={roomPriceTotal}
              roomCount={roomCount}
              serviceFee={serviceFee}
              totalPayable={totalPayable}
              bookingSuccess={bookingSuccess}
              bookingRef={bookingRef}
              submitBooking={submitBooking}
              bookingSubmitting={submitting}
              bookingError={bookingError}
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
}
