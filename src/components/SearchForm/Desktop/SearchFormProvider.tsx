import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useAppStore } from '@/store/hooks';
import {
  setPlace,
  setPlaceSelection,
  setSurpriseMe,
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
  const store = useAppStore();

  // Manage state from Redux store
  const {
    place: placeValue,
    placeRegionId,
    isSurpriseMe,
    checkIn: checkInValue,
    checkOut: checkOutValue,
    travelers: travelersValue,
  } = useAppSelector((state) => state.search);

  const handleSearch = () => {
    const currentState = store.getState().search;
    const {
      place,
      placeRegionId: regionId,
      isSurpriseMe: surprise,
      checkIn,
      checkOut,
      travelers,
    } = currentState;

    if (!isValidDateRange(checkIn, checkOut)) return;
    if (regionId == null && !surprise) return;

    const params = new URLSearchParams();
    params.append('place', place);
    if (regionId != null) {
      params.append('regionId', String(regionId));
    }
    if (surprise) {
      params.append('surprise', 'true');
    }
    params.append('checkIn', checkIn);
    params.append('checkOut', checkOut);
    params.append('travelers', travelers);
    navigate(`/stays?${params.toString()}`);
  };

  const contextValue: SearchFormContextProps = {
    placeValue,
    placeRegionId,
    isSurpriseMe,
    checkInValue,
    checkOutValue,
    travelersValue,
    onPlaceChange: (val) => dispatch(setPlace(val)),
    onPlaceSelect: (regionId, label) =>
      dispatch(setPlaceSelection({ regionId, label })),
    onSurpriseMeSelect: () => dispatch(setSurpriseMe()),
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
