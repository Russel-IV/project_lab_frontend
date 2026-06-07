import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectionField } from './SelectionField';
import {
  SelectionSelector,
  DatesSelector,
  TravelersSelector,
  BaseCycleSelector,
} from './models';
import './SearchForm.css';

export const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  // Create state for the selector instances to drive React reactivity
  const [selectionSelector, setSelectionSelector] = useState(
    () => new SelectionSelector(),
  );
  const [datesSelector, setDatesSelector] = useState(() => new DatesSelector());
  const [travelersSelector, setTravelersSelector] = useState(
    () => new TravelersSelector(),
  );

  // Generalized handler following SOLID principles (Open-Closed, LSP)
  const handleCycle = <T extends BaseCycleSelector<string>>(
    selector: T,
    setter: React.Dispatch<React.SetStateAction<T>>,
    SelectorClass: new (index: number) => T,
  ) => {
    // Perform cycling logic inside domain class model
    selector.cycle();

    // Create new instance with the updated index to trigger React state change
    setter(new SelectorClass(selector.currentIndex));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append('selection', selectionSelector.getCurrentValue());
    params.append('dates', datesSelector.getCurrentValue());
    params.append('travelers', travelersSelector.getCurrentValue());
    navigate(`/stays?${params.toString()}`);
  };

  return (
    <div className="form-component-wrapper">
      <div className="form-card">
        <div className="form-grid">
          <SelectionField
            selector={selectionSelector}
            onCycle={() =>
              handleCycle(
                selectionSelector,
                setSelectionSelector,
                SelectionSelector,
              )
            }
          />

          <SelectionField
            selector={datesSelector}
            onCycle={() =>
              handleCycle(datesSelector, setDatesSelector, DatesSelector)
            }
            showIcon={true}
          />

          <SelectionField
            selector={travelersSelector}
            onCycle={() =>
              handleCycle(
                travelersSelector,
                setTravelersSelector,
                TravelersSelector,
              )
            }
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="search-button !bg-[#E8660D] !text-white"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
