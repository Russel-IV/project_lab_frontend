import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPlace,
  setPlaceSelection,
  setDates,
  setTravelers,
} from '@/store/searchSlice';
import { type DateRange } from 'react-day-picker';
import { format, parse, startOfDay } from 'date-fns';
import {
  parseISOToDateRange,
  formatDatesRange,
  type RoomConfig,
  parseTravelersValue,
  serializeTravelersValue,
  isValidDateRange,
  saveRecentSearch,
} from '../searchFormUtils';

interface UseSearchFormMobileStateProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActiveSection?: 'where' | 'dates' | 'travelers';
  onSubmit?: (data: {
    checkIn: string;
    checkOut: string;
    travelers: string;
  }) => void;
  hideWhereSection?: boolean;
}

/**
 * useSearchFormMobileState
 *
 * Custom hook managing the temporary state for the mobile search accordion and modal.
 * Synchronizes search state, configures rooms, parses dates, and updates store or calls onSubmit.
 */
export const useSearchFormMobileState = ({
  isOpen,
  onClose,
  defaultActiveSection,
  onSubmit,
  hideWhereSection = false,
}: UseSearchFormMobileStateProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get current search state from Redux
  const reduxSearch = useAppSelector((state) => state.search);

  // Local state for form options inside modal
  const [localPlace, setLocalPlaceRaw] = useState(reduxSearch.place);
  const [localPlaceRegionId, setLocalPlaceRegionId] = useState<number | null>(
    reduxSearch.placeRegionId,
  );
  const [localCheckIn, setLocalCheckIn] = useState(reduxSearch.checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(reduxSearch.checkOut);
  const [localTravelers, setLocalTravelers] = useState(reduxSearch.travelers);

  // Active section inside the accordion: 'where' | 'dates' | 'travelers'
  const [activeSection, setActiveSection] = useState<
    'where' | 'dates' | 'travelers'
  >(defaultActiveSection || (hideWhereSection ? 'dates' : 'where'));

  // Parse local travelers configuration
  const [rooms, setRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(reduxSearch.travelers),
  );

  // Manage body scroll locking when modal is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Free typing: clears any previously selected regionId, since it no
  // longer necessarily matches the new text (mirrors searchSlice.setPlace).
  const setLocalPlace = (val: string) => {
    setLocalPlaceRaw(val);
    setLocalPlaceRegionId(null);
  };

  // Handle select suggestion (or a recent search - which may or may not
  // carry a regionId, depending on how it was originally saved).
  const handleSelectPlace = (label: string, regionId?: number) => {
    setLocalPlaceRaw(label);
    setLocalPlaceRegionId(regionId ?? null);
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
    setActiveSection(
      defaultActiveSection || (hideWhereSection ? 'dates' : 'where'),
    );
  };

  const handleSearchSubmit = () => {
    if (!isValidDateRange(localCheckIn, localCheckOut)) return;

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
    if (localPlaceRegionId != null) {
      dispatch(
        setPlaceSelection({ regionId: localPlaceRegionId, label: localPlace }),
      );
    } else {
      dispatch(setPlace(localPlace));
    }
    dispatch(setDates({ checkIn: localCheckIn, checkOut: localCheckOut }));
    dispatch(setTravelers(localTravelers));

    // Save to localStorage recent searches
    if (localPlace.trim() !== '') {
      saveRecentSearch({
        label: localPlace.trim(),
        regionId: localPlaceRegionId ?? undefined,
      });
    }

    // Navigate with query params
    const params = new URLSearchParams();
    params.append('place', localPlace);
    if (localPlaceRegionId != null) {
      params.append('regionId', String(localPlaceRegionId));
    }
    params.append('checkIn', localCheckIn);
    params.append('checkOut', localCheckOut);
    params.append('travelers', localTravelers);

    navigate(`/stays?${params.toString()}`);
    onClose();
  };

  return {
    localPlace,
    localPlaceRegionId,
    setLocalPlace,
    localCheckIn,
    localCheckOut,
    localTravelers,
    activeSection,
    setActiveSection,
    rooms,
    displayDatesValue,
    handleSelectPlace,
    handleSelectDates,
    updateAdults,
    addRoom,
    removeRoom,
    handleClearAll,
    handleSearchSubmit,
  };
};

export default useSearchFormMobileState;
