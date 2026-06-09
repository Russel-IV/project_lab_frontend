import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Plane,
  Car,
  Ticket,
  Ship,
  Calendar,
  User,
} from 'lucide-react';
import { SelectionStrategy, DatesStrategy, TravelersStrategy } from './models';
import { FormContainer } from './FormContainer';
import { FormCombobox } from './FormCombobox';
import { FormField } from './FormField';
import { FormSubmit } from './FormSubmit';
import './SearchForm.css';

// Instantiate stateless strategies once (outside component renders to avoid duplicates)
const selectionStrategy = new SelectionStrategy();
const datesStrategy = new DatesStrategy();
const travelersStrategy = new TravelersStrategy();

const tabs = [
  { id: 'stays', label: 'STAYS', icon: BedDouble },
  { id: 'flights', label: 'FLIGHTS', icon: Plane },
  { id: 'cars', label: 'CARS', icon: Car },
  { id: 'things', label: 'THINGS TO DO', icon: Ticket },
  { id: 'cruises', label: 'CRUISES', icon: Ship },
];

export const SearchForm: React.FC = () => {
  const navigate = useNavigate();

  // State for tabs
  const [activeTab, setActiveTab] = useState<string>('stays');

  // Manage selection state cleanly using standard primitive values
  const [selectionValue, setSelectionValue] = useState<string>('');
  const [datesValue, setDatesValue] = useState<string>(
    'Thu, Jun 25 - Sun, Jun 28',
  );
  const [travelersValue, setTravelersValue] = useState<string>(
    '6 travelers, 2 rooms',
  );
  const [addFlight] = useState<boolean>(false);

  // Pure state toggling logic using our stateless strategies
  const handleCycle = (
    currentVal: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    strategy: typeof datesStrategy | typeof travelersStrategy,
  ) => {
    setter(strategy.getNextValue(currentVal));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append('selection', selectionValue);
    params.append('dates', datesValue);
    params.append('travelers', travelersValue);
    params.append('addFlight', addFlight.toString());
    navigate(`/stays?${params.toString()}`);
  };

  return (
    <FormContainer>
      {/* Tabs Section */}
      <div className="form-tabs-list">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`form-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon
                className="form-tab-icon"
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="form-tab-text">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid containing inputs and submit button inline */}
      <div className="form-grid">
        <FormCombobox
          label={selectionStrategy.getLabel()}
          value={selectionValue}
          onValueChange={setSelectionValue}
          options={selectionStrategy.getOptions()}
          showClear={true}
        />

        <FormField
          label={datesStrategy.getLabel()}
          value={datesValue}
          onClick={() => handleCycle(datesValue, setDatesValue, datesStrategy)}
          icon={<Calendar className="w-5 h-5" strokeWidth={1.5} />}
        />

        <FormField
          label={travelersStrategy.getLabel()}
          value={travelersValue}
          onClick={() =>
            handleCycle(travelersValue, setTravelersValue, travelersStrategy)
          }
          icon={<User className="w-5 h-5" strokeWidth={1.5} />}
        />

        <FormSubmit onClick={handleSearch} />
      </div>
    </FormContainer>
  );
};

export default SearchForm;
