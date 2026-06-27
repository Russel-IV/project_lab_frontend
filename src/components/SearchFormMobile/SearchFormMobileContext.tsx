import { createContext, useContext } from 'react';
import { type DateRange } from 'react-day-picker';
import { type RoomConfig } from '@/components/Form/searchFormUtils';

export interface SearchFormMobileContextProps {
  localPlace: string;
  setLocalPlace: (val: string) => void;
  localCheckIn: string;
  localCheckOut: string;
  localTravelers: string;
  activeSection: 'where' | 'dates' | 'travelers';
  setActiveSection: (val: 'where' | 'dates' | 'travelers') => void;
  rooms: RoomConfig[];
  handleSelectPlace: (val: string) => void;
  handleSelectDates: (
    newRange: DateRange | undefined,
    selectedDay: Date,
  ) => void;
  updateAdults: (roomId: number, delta: number) => void;
  addRoom: () => void;
  removeRoom: (roomId: number) => void;
  displayDatesValue: string;
  onClose: () => void;
}

export const SearchFormMobileContext = createContext<
  SearchFormMobileContextProps | undefined
>(undefined);

export const useSearchFormMobile = () => {
  const context = useContext(SearchFormMobileContext);
  if (!context) {
    throw new Error(
      'SearchFormMobile subcomponents must be used within <SearchFormMobileContext.Provider>',
    );
  }
  return context;
};
