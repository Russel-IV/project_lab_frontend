import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const SearchForm: React.FC = () => {
  const navigate = useNavigate();

  // Manage selection state cleanly using standard primitive values
  const [selectionValue, setSelectionValue] = useState<string>('');
  const [datesValue, setDatesValue] = useState<string>(
    'Thu, Jun 25 - Sun, Jun 28',
  );
  const [travelersValue, setTravelersValue] = useState<string>('1 adult');

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
    navigate(`/stays?${params.toString()}`);
  };

  return (
    <FormContainer>
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
          showIcon={true}
        />

        <FormField
          label={travelersStrategy.getLabel()}
          value={travelersValue}
          onClick={() =>
            handleCycle(travelersValue, setTravelersValue, travelersStrategy)
          }
        />
      </div>

      <FormSubmit onClick={handleSearch} />
    </FormContainer>
  );
};

export default SearchForm;
