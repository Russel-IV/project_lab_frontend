import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { format, parse, startOfDay } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPlace, setDates, setTravelers } from '@/store/searchSlice';
import { type DateRange } from 'react-day-picker';
import {
  parseISOToDateRange,
  formatDatesRange,
  type RoomConfig,
  parseTravelersValue,
  serializeTravelersValue,
} from '@/components/Form/searchFormUtils';
import {
  SearchFormMobileContext,
  type SearchFormMobileContextProps,
} from './SearchFormMobileContext';
import { WhereSection } from './WhereSection';
import { DatesSection } from './DatesSection';
import { TravelersSection } from './TravelersSection';

interface SearchFormMobileProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActiveSection?: 'where' | 'dates' | 'travelers';
  onSubmit?: (data: {
    checkIn: string;
    checkOut: string;
    travelers: string;
  }) => void;
  submitButtonText?: string;
  children?: React.ReactNode;
}

/**
 * SearchFormMobile
 *
 * Full screen search form modal for mobile screens.
 * Orchestrates the search form state and layout sections via context.
 */
export const SearchFormMobile: React.FC<SearchFormMobileProps> & {
  Where: typeof WhereSection;
  Dates: typeof DatesSection;
  Travelers: typeof TravelersSection;
} = ({
  isOpen,
  onClose,
  defaultActiveSection,
  onSubmit,
  submitButtonText,
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get current search state from Redux
  const reduxSearch = useAppSelector((state) => state.search);

  // Local state for form options inside modal
  const [localPlace, setLocalPlace] = useState(reduxSearch.place);
  const [localCheckIn, setLocalCheckIn] = useState(reduxSearch.checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(reduxSearch.checkOut);
  const [localTravelers, setLocalTravelers] = useState(reduxSearch.travelers);

  // Active section inside the accordion: 'where' | 'dates' | 'travelers'
  const [activeSection, setActiveSection] = useState<
    'where' | 'dates' | 'travelers'
  >(defaultActiveSection || 'where');

  // Parse local travelers configuration
  const [rooms, setRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(reduxSearch.travelers),
  );

  // Manage body scroll locking when modal is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle select suggestion
  const handleSelectPlace = (val: string) => {
    setLocalPlace(val);
    setActiveSection('dates');
  };

  // Format dates for display
  const displayDatesValue = useMemo(() => {
    const selectedRange = parseISOToDateRange(localCheckIn, localCheckOut);
    const isSameDay =
      selectedRange.from &&
      selectedRange.to &&
      selectedRange.from.getTime() === selectedRange.to.getTime();

    if (!selectedRange.from || isSameDay) {
      return 'Select Dates';
    }
    return formatDatesRange(selectedRange);
  }, [localCheckIn, localCheckOut]);

  // Handle date selection from Calendar
  const handleSelectDates = (
    _newRange: DateRange | undefined,
    selectedDay: Date,
  ) => {
    if (!selectedDay) return;
    const selected = startOfDay(selectedDay);

    const hasCheckIn = !!localCheckIn;
    const hasCheckOut = !!localCheckOut;

    if ((!hasCheckIn && !hasCheckOut) || (hasCheckIn && hasCheckOut)) {
      // First click: nothing is selected or both are already selected.
      // Set selectedDay as the check-in and clear check-out.
      setLocalCheckIn(format(selected, 'yyyy-MM-dd'));
      setLocalCheckOut('');
    } else if (hasCheckIn && !hasCheckOut) {
      // Second click: only check-in is selected.
      const checkInDate = startOfDay(
        parse(localCheckIn, 'yyyy-MM-dd', new Date()),
      );
      if (selected.getTime() < checkInDate.getTime()) {
        // Selected date is before check-in. Make it the new check-in.
        setLocalCheckIn(format(selected, 'yyyy-MM-dd'));
        setLocalCheckOut('');
      } else {
        // Selected date is on or after check-in. Make it the check-out.
        setLocalCheckOut(format(selected, 'yyyy-MM-dd'));
      }
    }
  };

  // Handle traveler modifications
  const updateAdults = (roomId: number, delta: number) => {
    const updated = rooms.map((room) => {
      if (room.id === roomId) {
        return {
          ...room,
          adults: Math.max(1, Math.min(14, room.adults + delta)),
        };
      }
      return room;
    });
    setRooms(updated);
    setLocalTravelers(serializeTravelersValue(updated));
  };

  const addRoom = () => {
    const nextId =
      rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
    const updated = [...rooms, { id: nextId, adults: 1 }];
    setRooms(updated);
    setLocalTravelers(serializeTravelersValue(updated));
  };

  const removeRoom = (roomId: number) => {
    const updated = rooms.filter((r) => r.id !== roomId);
    setRooms(updated);
    setLocalTravelers(serializeTravelersValue(updated));
  };

  const handleClearAll = () => {
    setLocalPlace('');
    setLocalCheckIn('');
    setLocalCheckOut('');
    const defaultTravelers = '1 travelers, 1 rooms';
    setLocalTravelers(defaultTravelers);
    setRooms(parseTravelersValue(defaultTravelers));
    setActiveSection(defaultActiveSection || 'where');
  };

  const handleSearchSubmit = () => {
    if (onSubmit) {
      onSubmit({
        checkIn: localCheckIn,
        checkOut: localCheckOut,
        travelers: localTravelers,
      });
      onClose();
      return;
    }

    // Sync with Redux store
    dispatch(setPlace(localPlace));
    dispatch(setDates({ checkIn: localCheckIn, checkOut: localCheckOut }));
    dispatch(setTravelers(localTravelers));

    // Save to localStorage recent searches
    if (localPlace.trim() !== '') {
      try {
        const recent = JSON.parse(
          localStorage.getItem('recent_searches') || '[]',
        );
        const updated = [
          localPlace.trim(),
          ...recent.filter((p: string) => p !== localPlace.trim()),
        ].slice(0, 5);
        localStorage.setItem('recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent search to localStorage:', e);
      }
    }

    // Navigate with query params
    const params = new URLSearchParams();
    params.append('place', localPlace);
    params.append('checkIn', localCheckIn);
    params.append('checkOut', localCheckOut);
    params.append('travelers', localTravelers);

    navigate(`/stays?${params.toString()}`);
    onClose();
  };

  const contextValue: SearchFormMobileContextProps = {
    localPlace,
    setLocalPlace,
    localCheckIn,
    localCheckOut,
    localTravelers,
    activeSection,
    setActiveSection,
    rooms,
    handleSelectPlace,
    handleSelectDates,
    updateAdults,
    addRoom,
    removeRoom,
    displayDatesValue,
    onClose,
  };

  if (!isOpen) return null;

  return (
    <SearchFormMobileContext.Provider value={contextValue}>
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F2F2F2] overflow-y-auto select-none p-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="self-end w-10 h-10 flex items-center justify-center bg-frui-white border border-[#d6c7b9] rounded-full shadow-sm text-frui-blue cursor-pointer mb-6"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main accordion list */}
        <div className="flex flex-col gap-4 flex-1 pb-24">{children}</div>

        {/* Footer bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-frui-white border-t border-[#d6c7b9] px-6 py-4 flex justify-between items-center z-10">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-bold text-frui-blue cursor-pointer bg-transparent border-0 p-0"
          >
            Clean Everything
          </button>

          <button
            type="button"
            onClick={handleSearchSubmit}
            className="flex items-center gap-2 bg-frui-orange text-frui-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm cursor-pointer border-0"
          >
            {!submitButtonText && (
              <Search className="h-4 w-4 text-frui-white" />
            )}
            <span>{submitButtonText || 'Search'}</span>
          </button>
        </div>
      </div>
    </SearchFormMobileContext.Provider>
  );
};

SearchFormMobile.Where = WhereSection;
SearchFormMobile.Dates = DatesSection;
SearchFormMobile.Travelers = TravelersSection;

export default SearchFormMobile;
