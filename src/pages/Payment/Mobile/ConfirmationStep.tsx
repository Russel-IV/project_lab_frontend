import { type DateRange } from 'react-day-picker';
import type { GetStayDetailsQuery } from '@/types/__generated__/graphql';
import { MapPin, Star, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { formatDatesRange } from '@/components/SearchForm/searchFormUtils';
import { formatPrice, formatTravelers } from '@/utils/format';

interface ConfirmationStepProps {
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
}

export default function ConfirmationStep({
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
}: ConfirmationStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-frui-blue tracking-tight">
          Review &amp; Confirm
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Please review your trip details and complete your booking.
        </p>
      </div>

      {/* Stay Recap card */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border overflow-hidden bg-[#fafafa]">
        {stay?.pictures && stay.pictures.length > 0 && (
          <img
            src={stay.pictures[0].url}
            alt={stay.name}
            className="w-full h-32 object-cover"
          />
        )}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="size-3.5 text-frui-orange shrink-0" />
            <span>
              {stay?.address?.streetAddress}, {stay?.address?.city}
            </span>
          </div>
          <h3 className="font-bold text-base text-frui-blue leading-snug">
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

      {/* Stay Dates & Duration breakdown */}
      <div className="flex flex-col gap-3 p-4 bg-[#fcf8f5] border border-frui-orange/15 rounded-2xl">
        <div className="flex items-center gap-3 text-xs text-neutral-700">
          <Calendar className="size-4 text-frui-blue shrink-0" />
          <div>
            <p className="font-bold text-frui-blue">Check-in / Check-out</p>
            <p className="mt-0.5">
              {formatDatesRange(dateRange) ||
                `${resolvedCheckIn} to ${resolvedCheckOut}`}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-medium">
              ({nights} nights)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-700 border-t border-border/60 pt-3">
          <Users className="size-4 text-frui-blue shrink-0" />
          <div>
            <p className="font-bold text-frui-blue">Guests</p>
            <p className="mt-0.5">{formatTravelers(resolvedTravelers)}</p>
          </div>
        </div>
      </div>

      {/* Promotion / statement credit ad */}
      <div className="border border-[#c6dbf7] bg-[#ebf3fc] rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-[#d2e4fa] px-4 py-2 text-xs font-bold text-[#1a5fb4] flex items-center justify-between">
          <span>Get $100 back from this trip</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <div className="w-16 h-10 bg-frui-blue rounded-md border border-neutral-800 shadow-xs flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-frui-cream tracking-widest">
                KEYCARD
              </span>
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#121324] leading-tight">
                Get a $100 statement credit + $150 in OneKeyCash*
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">
                *after qualifying purchases. Terms apply.
              </p>
              <p className="text-[10px] text-emerald-700 font-bold mt-1">
                No annual fee
              </p>
            </div>
          </div>

          <div className="border-t border-[#c6dbf7] pt-2 flex flex-col gap-1.5 text-xs text-[#4b5563]">
            <div className="flex justify-between">
              <span>You pay</span>
              <span>{formatPrice(totalPayable)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Statement credit</span>
              <span>-{formatPrice(100000)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#121324] border-t border-dashed border-[#c6dbf7] pt-1.5 mt-0.5">
              <span>Total after statement credit</span>
              <span>{formatPrice(Math.max(0, totalPayable - 100000))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Good Taste Banner */}
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3.5 flex gap-2.5 items-start leading-normal font-medium shadow-xs">
        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>You have good taste! Book now before someone else grabs it!</span>
      </div>

      {/* Final Price Breakdown details */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 mt-2">
        <h3 className="font-bold text-sm text-frui-blue">Price details</h3>
        <div className="flex flex-col gap-2 text-xs text-neutral-600">
          <div className="flex justify-between">
            <span>
              {roomCount} {roomCount === 1 ? 'room' : 'rooms'} x {nights} nights
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

        <div className="border-t border-border pt-3 flex flex-col gap-1.5 text-xs">
          <h4 className="font-bold text-neutral-800">
            Deposits collected by property
          </h4>
          <div className="flex justify-between text-neutral-600">
            <div>
              <span>Your first payment</span>
              <p className="text-[10px] text-neutral-400 font-medium">Today</p>
            </div>
            <span className="font-bold text-neutral-800">
              {formatPrice(totalPayable)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
