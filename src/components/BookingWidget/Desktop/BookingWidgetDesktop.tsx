import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setBookingDates, setBookingTravelers } from '@/store/bookingSlice';
import { type DateRange } from 'react-day-picker';
import {
  parseISOToDateRange,
  type RoomConfig,
  parseTravelersValue,
  serializeTravelersValue,
} from '@/components/SearchForm/searchFormUtils';
import {
  formatPrice,
  formatTravelers,
  getFreeCancellationText,
} from '@/utils/format';
import { calculateNights } from '@/utils/date';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RangeCalendar } from '@/components/calendar';

import { useBookingWidget } from '../BookingWidgetContext';

export const BookingWidgetDesktop: React.FC = () => {
  const { stay } = useBookingWidget();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchState = useAppSelector((state) => state.search);
  const { checkIn, checkOut, travelers, selectedRooms } = useAppSelector(
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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCalendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        const trigger = document.getElementById('booking-dates-trigger');
        if (trigger && trigger.contains(event.target as Node)) {
          return;
        }
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const [localRooms, setLocalRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(travelers || '1 travelers, 1 rooms'),
  );

  const dateRange = useMemo(() => {
    return parseISOToDateRange(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const nights = useMemo(() => {
    return calculateNights(dateRange);
  }, [dateRange]);

  const selectedRoomsNightly = useMemo(
    () => selectedRooms.reduce((sum, room) => sum + room.price, 0),
    [selectedRooms],
  );
  const price =
    selectedRoomsNightly || (stay?.startingFromPrice as number) || 0;

  const formattedNightly = useMemo(() => {
    return formatPrice(price, true);
  }, [price]);

  const totalPrice = useMemo(() => {
    return price * nights;
  }, [price, nights]);

  const formattedTotal = useMemo(() => {
    return formatPrice(totalPrice, true);
  }, [totalPrice]);

  const travelersText = useMemo(() => {
    return formatTravelers(travelers);
  }, [travelers]);

  const formattedCheckInLabel = useMemo(() => {
    if (!dateRange.from) return 'Add date';
    return format(dateRange.from, 'd/M/yyyy');
  }, [dateRange.from]);

  const formattedCheckOutLabel = useMemo(() => {
    if (!dateRange.to) return 'Add date';
    return format(dateRange.to, 'd/M/yyyy');
  }, [dateRange.to]);

  const freeCancellationText = useMemo(() => {
    return getFreeCancellationText(!!stay?.isRefundable, checkIn);
  }, [stay?.isRefundable, checkIn]);

  const handleDateSelect = (newRange: DateRange | undefined) => {
    const isCompleteRange =
      dateRange.from &&
      dateRange.to &&
      dateRange.from.getTime() !== dateRange.to.getTime();

    if (isCompleteRange) {
      if (newRange?.from) {
        dispatch(
          setBookingDates({
            checkIn: format(newRange.from, 'yyyy-MM-dd'),
            checkOut: '',
          }),
        );
      } else {
        dispatch(setBookingDates({ checkIn: '', checkOut: '' }));
      }
    } else if (newRange) {
      const fromStr = newRange.from ? format(newRange.from, 'yyyy-MM-dd') : '';
      const toStr = newRange.to ? format(newRange.to, 'yyyy-MM-dd') : '';
      dispatch(setBookingDates({ checkIn: fromStr, checkOut: toStr }));
      if (fromStr && toStr) {
        setIsCalendarOpen(false);
      }
    } else {
      dispatch(setBookingDates({ checkIn: '', checkOut: '' }));
    }
  };

  const handleGuestsOpenChange = (isOpen: boolean) => {
    setIsGuestsOpen(isOpen);
    if (isOpen) {
      setLocalRooms(parseTravelersValue(travelers || '1 travelers, 1 rooms'));
    } else {
      const formatted = serializeTravelersValue(localRooms);
      dispatch(setBookingTravelers(formatted));
    }
  };

  const updateAdults = (roomId: number, delta: number) => {
    setLocalRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const nextAdults = Math.max(1, Math.min(14, room.adults + delta));
          return { ...room, ...{ adults: nextAdults } };
        }
        return room;
      }),
    );
  };

  const addRoom = () => {
    setLocalRooms((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        adults: 1,
      },
    ]);
  };

  const removeRoom = (roomId: number) => {
    setLocalRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleDone = () => {
    handleGuestsOpenChange(false);
  };

  if (!stay) return null;

  return (
    <div className="relative">
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute right-[calc(100%+16px)] top-0 h-full w-[600px] bg-frui-white border border-border shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-3xl p-6 z-50 flex flex-col justify-center select-none"
        >
          <RangeCalendar
            defaultMonth={dateRange.from || new Date()}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={(date) => date < startOfDay(new Date())}
          />
        </div>
      )}

      <div className="bg-frui-white rounded-3xl p-6 border border-border w-full flex flex-col gap-5 min-h-[380px]">
        <div className="flex flex-col gap-0.5 select-none">
          <div className="flex items-baseline text-foreground">
            <span className="text-2xl font-bold underline leading-none">
              {formattedNightly}
            </span>
            <span className="text-sm font-medium text-muted-foreground ml-1">
              per night
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mt-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Available dates</span>
          </div>
        </div>

        <div className="border border-neutral-300 rounded-xl overflow-hidden bg-frui-white">
          <div
            id="booking-dates-trigger"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="grid grid-cols-2 divide-x divide-neutral-300 cursor-pointer border-b border-neutral-300 select-none hover:bg-neutral-50/50"
          >
            <div className="p-3 flex flex-col text-left">
              <span className="text-[9px] font-bold text-frui-blue tracking-wide uppercase">
                Check-in
              </span>
              <span className="text-sm font-medium text-neutral-800 mt-1">
                {formattedCheckInLabel}
              </span>
            </div>
            <div className="p-3 flex flex-col text-left">
              <span className="text-[9px] font-bold text-frui-blue tracking-wide uppercase">
                Check-out
              </span>
              <span className="text-sm font-medium text-neutral-800 mt-1">
                {formattedCheckOutLabel}
              </span>
            </div>
          </div>

          <Popover open={isGuestsOpen} onOpenChange={handleGuestsOpenChange}>
            <PopoverTrigger
              render={
                <div className="p-3 flex items-center justify-between cursor-pointer select-none hover:bg-neutral-50/50">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-frui-blue tracking-wide uppercase">
                      Guests
                    </span>
                    <span className="text-sm font-medium text-neutral-800 mt-1">
                      {travelersText}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-frui-blue shrink-0" />
                </div>
              }
            />
            <PopoverContent
              className="w-80 p-5 bg-frui-white border border-border rounded-xl shadow-xl z-55 flex flex-col gap-4 text-foreground"
              align="end"
              side="bottom"
            >
              <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {localRooms.map((room, index) => (
                  <div
                    key={room.id}
                    className="flex flex-col gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <span className="font-bold text-foreground text-xs uppercase tracking-wide">
                      Room {index + 1}
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-neutral-700">
                        Adults
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateAdults(room.id, -1)}
                          disabled={room.adults <= 1}
                          className="size-7 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Minus className="size-3.5 text-neutral-600" />
                        </button>
                        <span className="w-4 text-center font-bold text-sm select-none">
                          {room.adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateAdults(room.id, 1)}
                          disabled={room.adults >= 14}
                          className="size-7 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Plus className="size-3.5 text-neutral-600" />
                        </button>
                      </div>
                    </div>
                    {localRooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(room.id)}
                        className="text-xs text-frui-orange font-bold hover:underline self-end cursor-pointer bg-transparent border-0 p-0"
                      >
                        Remove Room
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addRoom}
                className="text-xs text-frui-orange font-bold hover:underline self-start cursor-pointer flex items-center gap-1 bg-transparent border-0 p-0"
              >
                <Plus className="size-3.5" /> Add Room
              </button>

              <div className="flex justify-end pt-3 border-t border-border mt-1">
                <button
                  type="button"
                  onClick={handleDone}
                  className="bg-transparent text-frui-orange border border-frui-orange hover:bg-frui-orange/10 font-bold rounded-lg px-4 py-1.5 text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {freeCancellationText && (
          <div className="bg-[#f5f5f5] rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-700 text-center select-none leading-normal">
            {freeCancellationText}
          </div>
        )}

        <button
          type="button"
          disabled={selectedRooms.length === 0}
          onClick={() => stay && navigate(`/payment/${stay.id}`)}
          className="w-full bg-frui-orange hover:bg-frui-orange/95 active:scale-[0.98] text-frui-white font-bold py-3.5 rounded-xl text-sm shadow-xs border-0 cursor-pointer text-center transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          Reserve
        </button>
        {selectedRooms.length === 0 && (
          <p className="text-xs text-center text-muted-foreground -mt-2">
            Select a room to continue
          </p>
        )}

        {nights > 1 && (
          <div className="flex justify-between items-center text-sm font-semibold border-t border-border pt-4 mt-1 select-none">
            <span className="text-neutral-500">Total</span>
            <span className="text-neutral-900 font-bold">{formattedTotal}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWidgetDesktop;
