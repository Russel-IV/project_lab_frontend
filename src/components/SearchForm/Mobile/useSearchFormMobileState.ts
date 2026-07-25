import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPlaceSelection,
  setSurpriseMe,
  setDates,
  setTravelers,
  SURPRISE_ME_LABEL,
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

export const useSearchFormMobileState = ({
  isOpen,
  onClose,
  defaultActiveSection,
  onSubmit,
  hideWhereSection = false,
}: UseSearchFormMobileStateProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const reduxSearch = useAppSelector((state) => state.search);

  const [localPlace, setLocalPlaceRaw] = useState(reduxSearch.place);
  const [localPlaceRegionId, setLocalPlaceRegionId] = useState<number | null>(
    reduxSearch.placeRegionId,
  );
  const [localIsSurpriseMe, setLocalIsSurpriseMe] = useState(
    reduxSearch.isSurpriseMe,
  );
  const [localCheckIn, setLocalCheckIn] = useState(reduxSearch.checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(reduxSearch.checkOut);
  const [localTravelers, setLocalTravelers] = useState(reduxSearch.travelers);

  const [activeSection, setActiveSection] = useState<
    'where' | 'dates' | 'travelers'
  >(defaultActiveSection || (hideWhereSection ? 'dates' : 'where'));

  const [rooms, setRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(reduxSearch.travelers),
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mirrors searchSlice.setPlace: free typing clears any previously
  // selected regionId since it no longer matches the new text.
  const setLocalPlace = (val: string) => {
    setLocalPlaceRaw(val);
    setLocalPlaceRegionId(null);
    setLocalIsSurpriseMe(false);
  };

  const handleSelectPlace = (label: string, regionId?: number) => {
    setLocalPlaceRaw(label);
    setLocalPlaceRegionId(regionId ?? null);
    setLocalIsSurpriseMe(false);
    setActiveSection('dates');
  };

  const handleSelectSurpriseMe = () => {
    setLocalPlaceRaw(SURPRISE_ME_LABEL);
    setLocalPlaceRegionId(null);
    setLocalIsSurpriseMe(true);
    setActiveSection('dates');
  };

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

  const handleSelectDates = (
    _newRange: DateRange | undefined,
    selectedDay: Date,
  ) => {
    if (!selectedDay) return;
    const selected = startOfDay(selectedDay);

    const hasCheckIn = !!localCheckIn;
    const hasCheckOut = !!localCheckOut;

    if ((!hasCheckIn && !hasCheckOut) || (hasCheckIn && hasCheckOut)) {
      setLocalCheckIn(format(selected, 'yyyy-MM-dd'));
      setLocalCheckOut('');
    } else if (hasCheckIn && !hasCheckOut) {
      const checkInDate = startOfDay(
        parse(localCheckIn, 'yyyy-MM-dd', new Date()),
      );
      if (selected.getTime() < checkInDate.getTime()) {
        setLocalCheckIn(format(selected, 'yyyy-MM-dd'));
        setLocalCheckOut('');
      } else {
        setLocalCheckOut(format(selected, 'yyyy-MM-dd'));
      }
    }
  };

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

    if (localIsSurpriseMe) {
      dispatch(setSurpriseMe());
    } else if (localPlaceRegionId != null) {
      dispatch(
        setPlaceSelection({ regionId: localPlaceRegionId, label: localPlace }),
      );
      if (localPlace.trim() !== '') {
        saveRecentSearch({
          label: localPlace.trim(),
          regionId: localPlaceRegionId,
        });
      }
    } else {
      return;
    }

    dispatch(setDates({ checkIn: localCheckIn, checkOut: localCheckOut }));
    dispatch(setTravelers(localTravelers));

    const params = new URLSearchParams();
    params.append('place', localPlace);
    if (localPlaceRegionId != null) {
      params.append('regionId', String(localPlaceRegionId));
    }
    if (localIsSurpriseMe) {
      params.append('surprise', 'true');
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
    localIsSurpriseMe,
    setLocalPlace,
    localCheckIn,
    localCheckOut,
    localTravelers,
    activeSection,
    setActiveSection,
    rooms,
    displayDatesValue,
    handleSelectPlace,
    handleSelectSurpriseMe,
    handleSelectDates,
    updateAdults,
    addRoom,
    removeRoom,
    handleClearAll,
    handleSearchSubmit,
  };
};

export default useSearchFormMobileState;
