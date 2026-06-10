import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPlace, setDates, setTravelers } from '@/store/searchSlice';
import { Calendar as CalendarIcon, User } from 'lucide-react';
import { FormCombobox } from './FormCombobox';
import { FormField } from './FormField';
import { FormSubmit } from './FormSubmit';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import {
  staysOptions,
  getNextTravelerValue,
  parseDatesString,
  formatDatesRange,
} from './searchFormUtils';
import './SearchForm.css';

interface SearchFormContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  placeValue: string;
  datesValue: string;
  travelersValue: string;
  onPlaceChange: (val: string) => void;
  onDatesChange: (val: string) => void;
  onTravelersChange: (val: string) => void;
  onSubmit: () => void;
}

const SearchFormContext = createContext<SearchFormContextProps | undefined>(
  undefined,
);

const useSearchForm = () => {
  const context = useContext(SearchFormContext);
  if (!context) {
    throw new Error(
      'SearchForm compound components must be used within a <SearchForm>',
    );
  }
  return context;
};

// Root Component: SearchForm container providing context
export function SearchForm({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State for tabs
  const [activeTab, setActiveTab] = useState<string>('stays');

  // Manage place state from Redux store
  const {
    place: placeValue,
    dates: datesValue,
    travelers: travelersValue,
  } = useAppSelector((state) => state.search);
  const [addFlight] = useState<boolean>(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append('place', placeValue);
    params.append('dates', datesValue);
    params.append('travelers', travelersValue);
    params.append('addFlight', addFlight.toString());
    navigate(`/stays?${params.toString()}`);
  };

  const contextValue: SearchFormContextProps = {
    activeTab,
    setActiveTab,
    placeValue,
    datesValue,
    travelersValue,
    onPlaceChange: (val) => dispatch(setPlace(val)),
    onDatesChange: (val) => dispatch(setDates(val)),
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

const SearchFormCombobox: React.FC<{ showClear?: boolean }> = ({
  showClear = true,
}) => {
  const { placeValue, onPlaceChange } = useSearchForm();
  return (
    <FormCombobox
      label="Where to?"
      value={placeValue}
      onValueChange={onPlaceChange}
      options={staysOptions}
      showClear={showClear}
    />
  );
};

const SearchFormDatesField: React.FC = () => {
  const { datesValue, onDatesChange } = useSearchForm();

  // Parse current Redux state string back to a DateRange object
  const selectedRange = React.useMemo(
    () => parseDatesString(datesValue),
    [datesValue],
  );

  const handleSelect = (newRange: DateRange | undefined) => {
    const isCompleteRange =
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from.getTime() !== selectedRange.to.getTime();

    if (isCompleteRange) {
      onDatesChange('');
    } else if (newRange) {
      const formatted = formatDatesRange(newRange);
      onDatesChange(formatted);
    } else {
      onDatesChange('');
    }
  };

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <FormField
            label="Dates"
            value={datesValue}
            onClick={() => {}}
            icon={<CalendarIcon className="w-5 h-5" strokeWidth={1.5} />}
          />
        }
      />
      <PopoverContent className="w-auto p-0 bg-white border border-[#d6c7b9] rounded-lg shadow-xl text-[#121324] z-50">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={{ before: today }}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
};

const SearchFormTravelersField: React.FC = () => {
  const { travelersValue, onTravelersChange } = useSearchForm();
  return (
    <FormField
      label="Travelers"
      value={travelersValue}
      onClick={() => onTravelersChange(getNextTravelerValue(travelersValue))}
      icon={<User className="w-5 h-5" strokeWidth={1.5} />}
    />
  );
};

const SearchFormSubmit: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { onSubmit } = useSearchForm();
  return <FormSubmit onClick={onClick ?? onSubmit} />;
};

SearchForm.Tabs = SearchFormTabs;
SearchForm.Tab = SearchFormTab;
SearchForm.Grid = SearchFormGrid;
SearchForm.Combobox = SearchFormCombobox;
SearchForm.DatesField = SearchFormDatesField;
SearchForm.TravelersField = SearchFormTravelersField;
SearchForm.Submit = SearchFormSubmit;

export default SearchForm;
