import React, { useState, useMemo, useEffect } from 'react';
import { Info, CheckCircle2, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setBookingDates, setBookingTravelers } from '@/store/bookingSlice';
import {
  parseISOToDateRange,
  formatDatesRange,
} from '@/components/SearchForm/searchFormUtils';
import { formatPrice, formatTravelers } from '@/utils/format';
import { calculateNights } from '@/utils/date';
import { SearchFormMobile } from '@/components/SearchForm';
import { useNavigate } from 'react-router-dom';

import { useBookingWidget } from '../BookingWidgetContext';

export const BookingWidgetMobile: React.FC = () => {
  const { stay } = useBookingWidget();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchState = useAppSelector((state) => state.search);
  const { checkIn, checkOut, travelers } = useAppSelector(
    (state) => state.booking,
  );

  useEffect(() => {
    dispatch(
      setBookingDates({
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut,
      }),
    );
    dispatch(setBookingTravelers(searchState.travelers));
  }, [
    dispatch,
    searchState.checkIn,
    searchState.checkOut,
    searchState.travelers,
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse check-in and check-out dates
  const dateRange = useMemo(() => {
    return parseISOToDateRange(checkIn, checkOut);
  }, [checkIn, checkOut]);

  // Compute number of nights
  const nights = useMemo(() => {
    return calculateNights(dateRange);
  }, [dateRange]);

  // Compute and format prices
  const price = (stay?.startingFromPrice as number) ?? 0;

  const formattedNightly = useMemo(() => {
    return formatPrice(price);
  }, [price]);

  const totalPrice = useMemo(() => {
    return price * nights;
  }, [price, nights]);

  const formattedTotal = useMemo(() => {
    return formatPrice(totalPrice);
  }, [totalPrice]);

  // Format travelers text
  const travelersText = useMemo(() => {
    return formatTravelers(travelers);
  }, [travelers]);

  // Format dates text
  const datesText = useMemo(() => {
    if (!dateRange.from) return 'Select dates';
    return formatDatesRange(dateRange);
  }, [dateRange]);

  const locationText = stay?.address?.city || 'Where to?';
  const isRefundable = stay?.isRefundable ?? false;

  const handleModalSubmit = (updatedData: {
    checkIn: string;
    checkOut: string;
    travelers: string;
  }) => {
    dispatch(
      setBookingDates({
        checkIn: updatedData.checkIn,
        checkOut: updatedData.checkOut,
      }),
    );
    dispatch(setBookingTravelers(updatedData.travelers));
  };

  if (!stay) return null;

  return (
    <div className="bg-frui-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-neutral-100 w-full">
      {/* 1. Status Indicators */}
      <div className="space-y-1">
        {isRefundable ? (
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <span>Refundable</span>
            <Info className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600 text-xs font-semibold uppercase tracking-wider">
            <span>Non-refundable</span>
            <Info className="h-3.5 w-3.5 text-red-500 shrink-0" />
          </div>
        )}

        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Your dates are available</span>
        </div>
      </div>

      {/* 2. Interactive Trigger Capsule */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full rounded-full border border-[#d6c7b9] px-4 py-2.5 text-left flex items-center gap-3 bg-frui-white mt-5 select-none focus:outline-none focus:ring-2 focus:ring-frui-blue cursor-pointer"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4ece4] text-[#a75d2e]">
          <Search className="h-4.5 w-4.5" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-bold truncate text-frui-blue">
            {locationText}
          </span>
          <span className="text-xs text-[#877D74] truncate mt-0.5">
            {datesText} • {travelersText}
          </span>
        </div>
      </button>

      {/* 3. Pricing Details */}
      <div className="flex flex-col items-end mt-5 mb-5">
        <span className="text-xs text-[#877D74] font-medium">
          {formattedNightly} nightly
        </span>
        <span className="text-xl font-bold text-frui-blue mt-0.5">
          {formattedTotal} total
        </span>
      </div>

      {/* 4. Action Button */}
      <button
        type="button"
        onClick={() => navigate(`/payment/${stay.id}`)}
        className="w-full bg-frui-blue text-frui-white font-bold py-3.5 rounded-full text-sm shadow-xs border-0 cursor-pointer text-center"
      >
        Reserve
      </button>

      {/* 5. Warning Footer */}
      <span className="text-[11px] text-[#877D74] text-center mt-3.5 block font-medium">
        You will not be charged yet
      </span>

      {/* Composable Search Modal */}
      {isModalOpen && (
        <SearchFormMobile
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultActiveSection="dates"
          onSubmit={handleModalSubmit}
          submitButtonText="Reserve"
          hideWhereSection={true}
        />
      )}
    </div>
  );
};

export default BookingWidgetMobile;
