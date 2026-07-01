import { createContext, useContext } from 'react';

export interface SearchFormContextProps {
  placeValue: string;
  checkInValue: string;
  checkOutValue: string;
  travelersValue: string;
  onPlaceChange: (val: string) => void;
  onDatesChange: (checkIn: string, checkOut: string) => void;
  onTravelersChange: (val: string) => void;
  onSubmit: () => void;
}

export const SearchFormContext = createContext<
  SearchFormContextProps | undefined
>(undefined);

export const useSearchForm = () => {
  const context = useContext(SearchFormContext);
  if (!context) {
    throw new Error(
      'SearchForm compound components must be used within a <SearchFormProvider>',
    );
  }
  return context;
};
