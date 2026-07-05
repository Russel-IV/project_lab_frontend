import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { GET_STAY_DETAILS } from '@/graphql/stays';
import type {
  GetStayDetailsQuery,
  GetStayDetailsQueryVariables,
} from '@/types/__generated__/graphql';
import { resetPaymentForm } from '@/store/paymentSlice';
import { parseISOToDateRange } from '@/components/SearchForm/searchFormUtils';
import { calculateNights } from '@/utils/date';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Button } from '@/components/ui/button';
import { format, startOfDay } from 'date-fns';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import PaymentMobile from './Mobile/PaymentMobile';
import PaymentDesktop from './Desktop/PaymentDesktop';
import { paymentSchema, type PaymentFormValues } from './Schemas/paymentSchema';

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  // Booking details from store
  const booking = useAppSelector((state) => state.booking);

  // Payment states from store
  const paymentState = useAppSelector((state) => state.payment);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

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

  const stay = data?.stay;

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
      cardNumber: paymentState.cardNumber,
      cardExpiryMonth: paymentState.cardExpiryMonth,
      cardExpiryYear: paymentState.cardExpiryYear,
      cardCvv: paymentState.cardCvv,
      billingCountry: paymentState.billingCountry,
      billingAddress1: paymentState.billingAddress1,
      billingAddress2: paymentState.billingAddress2,
      billingCity: paymentState.billingCity,
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
      cardNumber: '',
      cardExpiryMonth: '',
      cardExpiryYear: '',
      cardCvv: '',
      billingCountry: 'United States of America',
      billingAddress1: '',
      billingAddress2: '',
      billingCity: '',
      payWhen: 'now',
    });
  }, [dispatch, reset]);

  // Night and price calculations
  const dateRange = useMemo(
    () => parseISOToDateRange(resolvedCheckIn, resolvedCheckOut),
    [resolvedCheckIn, resolvedCheckOut],
  );
  const nights = useMemo(() => calculateNights(dateRange), [dateRange]);

  const pricePerNight = (stay?.startingFromPrice as number) || 120000;
  const roomPriceTotal = pricePerNight * nights;
  const serviceFee = Math.round(roomPriceTotal * 0.1375);
  const totalPayable = roomPriceTotal + serviceFee;

  if (loading) {
    return (
      <div className="flex-1 w-full bg-frui-cream flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
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
        <h1 className="text-xl font-bold text-frui-blue">Stay not found</h1>
        <p className="text-sm text-neutral-500 max-w-md">
          {error?.message || "We couldn't find the stay you are looking for."}
        </p>
        <Button
          onClick={() => navigate('/stays')}
          className="bg-frui-orange text-frui-white font-bold border-0 h-10 px-6 rounded-xl"
        >
          Back to Stays
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex-1 w-full bg-frui-cream">
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
              serviceFee={serviceFee}
              totalPayable={totalPayable}
              bookingSuccess={bookingSuccess}
              setBookingSuccess={setBookingSuccess}
              bookingRef={bookingRef}
              setBookingRef={setBookingRef}
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
              serviceFee={serviceFee}
              totalPayable={totalPayable}
              bookingSuccess={bookingSuccess}
              setBookingSuccess={setBookingSuccess}
              bookingRef={bookingRef}
              setBookingRef={setBookingRef}
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
}
