import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPlace, setDates, setTravelers } from '@/store/searchSlice';
import { Calendar as CalendarIcon, User, Plus, Minus } from 'lucide-react';
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
  parseDatesString,
  formatDatesRange,
  type RoomConfig,
  parseTravelersValue,
  serializeTravelersValue,
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
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(travelersValue),
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setRooms(parseTravelersValue(travelersValue));
    } else {
      const formatted = serializeTravelersValue(rooms);
      onTravelersChange(formatted);
    }
  };

  const updateAdults = (roomId: number, delta: number) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const nextAdults = Math.max(1, room.adults + delta);
          return { ...room, adults: nextAdults };
        }
        return room;
      }),
    );
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        adults: 2, // default to 2 adults for a new room
      },
    ]);
  };

  const removeRoom = (roomId: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleDone = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <FormField
            label="Travelers"
            value={travelersValue}
            onClick={() => {}}
            icon={<User className="w-5 h-5" strokeWidth={1.5} />}
          />
        }
      />
      <PopoverContent
        side="bottom"
        align="start"
        collisionAvoidance={{ side: 'none', fallbackAxisSide: 'none' }}
        className="w-[340px] p-5 bg-white border border-[#d6c7b9] rounded-lg shadow-xl text-[#121324] z-50 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="flex flex-col gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
            >
              <span className="font-bold text-foreground text-sm">
                Room {index + 1}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  Adults
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => updateAdults(room.id, -1)}
                    disabled={room.adults <= 1}
                    className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted/30 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Minus className="size-4 text-foreground" />
                  </button>
                  <span className="w-4 text-center font-medium text-sm select-none">
                    {room.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateAdults(room.id, 1)}
                    className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="size-4 text-foreground" />
                  </button>
                </div>
              </div>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-xs text-primary font-semibold hover:underline self-end cursor-pointer bg-transparent border-0 p-0"
                >
                  Remove room
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRoom}
          className="text-sm text-primary font-semibold hover:underline self-end cursor-pointer flex items-center gap-1 mt-1 bg-transparent border-0 p-0"
        >
          <Plus className="size-4" /> Add another room
        </button>

        <div className="flex justify-end items-center pt-3 border-t border-border/80 mt-2">
          <button
            type="button"
            onClick={handleDone}
            className="bg-primary hover:bg-primary/95 text-white font-medium rounded-full px-5 py-1.5 text-sm cursor-pointer border-0"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
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
