import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPlace, setDates, setTravelers } from '@/store/searchSlice';
import { FormSubmit } from './FormSubmit';
import {
  SearchFormContext,
  useSearchForm,
  type SearchFormContextProps,
} from './SearchFormContext';
import { SearchFormPlaceField } from './SearchFormPlaceField';
import { SearchFormDatesField } from './SearchFormDatesField';
import { SearchFormTravelersField } from './SearchFormTravelersField';
import './SearchForm.css';

// Root Component: SearchForm container providing context
export function SearchForm({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State for tabs
  const [activeTab, setActiveTab] = useState<string>('stays');

  // Manage place state from Redux store
  const {
    place: placeValue,
    checkIn: checkInValue,
    checkOut: checkOutValue,
    travelers: travelersValue,
  } = useAppSelector((state) => state.search);
  const [addFlight] = useState<boolean>(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append('place', placeValue);
    params.append('checkIn', checkInValue);
    params.append('checkOut', checkOutValue);
    params.append('travelers', travelersValue);
    params.append('addFlight', addFlight.toString());
    navigate(`/stays?${params.toString()}`);
  };

  const contextValue: SearchFormContextProps = {
    activeTab,
    setActiveTab,
    placeValue,
    checkInValue,
    checkOutValue,
    travelersValue,
    onPlaceChange: (val) => dispatch(setPlace(val)),
    onDatesChange: (checkIn, checkOut) =>
      dispatch(setDates({ checkIn, checkOut })),
    onTravelersChange: (val) => dispatch(setTravelers(val)),
    onSubmit: handleSearch,
  };

  return (
    <SearchFormContext.Provider value={contextValue}>
      <div className="form-card">{children}</div>
    </SearchFormContext.Provider>
  );
}

const SearchFormTabs: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="form-tabs-list">{children}</div>;
};

const SearchFormTab: React.FC<{
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}> = ({ id, icon: Icon, children }) => {
  const { activeTab, setActiveTab } = useSearchForm();
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      className={`form-tab-btn ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <Icon className="form-tab-icon" strokeWidth={isActive ? 2 : 1.5} />
      <span className="form-tab-text">{children}</span>
    </button>
  );
};

const SearchFormGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="form-grid">{children}</div>;
};

const SearchFormSubmit: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { onSubmit } = useSearchForm();
  return <FormSubmit onClick={onClick ?? onSubmit} />;
};

SearchForm.Tabs = SearchFormTabs;
SearchForm.Tab = SearchFormTab;
SearchForm.Grid = SearchFormGrid;
SearchForm.PlaceField = SearchFormPlaceField;
SearchForm.DatesField = SearchFormDatesField;
SearchForm.TravelersField = SearchFormTravelersField;
SearchForm.Submit = SearchFormSubmit;

export default SearchForm;
