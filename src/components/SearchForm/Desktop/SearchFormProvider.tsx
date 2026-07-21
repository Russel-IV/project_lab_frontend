import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPlace,
  setPlaceSelection,
  setDates,
  setTravelers,
} from '@/store/searchSlice';
import { isValidDateRange } from '../searchFormUtils';
import {
  SearchFormContext,
  type SearchFormContextProps,
} from './SearchFormContext';

/**
 * SearchFormProvider
 *
 * Provides Redux and router navigation state to desktop search fields.
 */
export const SearchFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Manage state from Redux store
  const {
    place: placeValue,
    placeRegionId,
    checkIn: checkInValue,
    checkOut: checkOutValue,
    travelers: travelersValue,
  } = useAppSelector((state) => state.search);

  const handleSearch = () => {
    if (!isValidDateRange(checkInValue, checkOutValue)) return;

    const params = new URLSearchParams();
    params.append('place', placeValue);
    if (placeRegionId != null) {
      params.append('regionId', String(placeRegionId));
    }
    params.append('checkIn', checkInValue);
    params.append('checkOut', checkOutValue);
    params.append('travelers', travelersValue);
    navigate(`/stays?${params.toString()}`);
  };

  const contextValue: SearchFormContextProps = {
    placeValue,
    placeRegionId,
    checkInValue,
    checkOutValue,
    travelersValue,
    onPlaceChange: (val) => dispatch(setPlace(val)),
    onPlaceSelect: (regionId, label) =>
      dispatch(setPlaceSelection({ regionId, label })),
    onDatesChange: (checkIn, checkOut) =>
      dispatch(setDates({ checkIn, checkOut })),
    onTravelersChange: (val) => dispatch(setTravelers(val)),
    onSubmit: handleSearch,
  };

  return (
    <SearchFormContext.Provider value={contextValue}>
      {children}
    </SearchFormContext.Provider>
  );
};

export default SearchFormProvider;
