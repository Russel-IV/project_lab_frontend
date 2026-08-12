import React, { useMemo, useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { useSearchForm } from './SearchFormContext';
import {
  useDestinations,
  usePopularDestinations,
} from '@/hooks/useDestinations';
import { formatDestinationLabel } from '@/utils/countryName';
import { SURPRISE_ME_VALUE } from '../searchFormUtils';
import { SURPRISE_ME_LABEL } from '@/store/searchSlice';

interface PlaceOption {
  value: number | string;
  label: string;
}

/**
 * Properties for the DestinationDropdown component.
 */
interface DestinationDropdownProps {
  options: PlaceOption[];
  onSelect: (value: number | string, label: string) => void;
  inputValue: string;
}

/**
 * Renders the list of destination options or empty state.
 *
 * @param props - Component properties containing options and selection handler.
 */
const DestinationDropdown: React.FC<DestinationDropdownProps> = ({
  options,
  onSelect,
  inputValue,
}) => {
  return (
    <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-full min-w-[320px] bg-frui-white border border-[#d6c7b9] rounded-2xl shadow-xl p-1.5 text-frui-blue overflow-hidden">
      <div className="max-h-[296px] overflow-y-auto rounded-xl pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400">
        {/* Surprise me option */}
        <button
          type="button"
          onClick={() => onSelect(SURPRISE_ME_VALUE, SURPRISE_ME_LABEL)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-frui-blue hover:bg-frui-cream rounded-lg transition-colors text-left cursor-pointer"
        >
          <span className="font-medium">{SURPRISE_ME_LABEL}</span>
        </button>

        {options.length === 0 && inputValue.trim() !== '' ? (
          <div className="px-3 py-2.5 text-xs text-[#7a7168] italic">
            No stays found matching &quot;{inputValue}&quot;
          </div>
        ) : (
          options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value, option.label)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-frui-blue hover:bg-frui-cream rounded-lg transition-colors text-left cursor-pointer"
            >
              <MapPin className="h-4 w-4 text-[#7a7168] shrink-0" />
              <span>{option.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Renders the search form place selection field component.
 *
 * @param props - Component properties including optional showClear flag.
 */
export const SearchFormPlaceField: React.FC<{ showClear?: boolean }> = ({
  showClear = true,
}) => {
  const {
    placeValue,
    onPlaceChange,
    onPlaceSelect,
    onSurpriseMeSelect,
    onSubmit,
  } = useSearchForm();

  const [inputValue, setInputValue] = useState(placeValue);
  const [prevPlaceValue, setPrevPlaceValue] = useState(placeValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (placeValue !== prevPlaceValue) {
    setInputValue(placeValue);
    setPrevPlaceValue(placeValue);
  }

  const { destinations: searchResults } = useDestinations(inputValue);
  const { destinations: popularDestinations } = usePopularDestinations();
  const destinations = inputValue.trim() ? searchResults : popularDestinations;

  const options = useMemo<PlaceOption[]>(
    () =>
      destinations.map((destination) => ({
        value: destination.regionId,
        label: formatDestinationLabel(
          destination.city,
          destination.countryCode,
        ),
      })),
    [destinations],
  );

  useEffect(() => {
    /**
     * Handles closing the dropdown when clicking outside the container.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Handles selection of a destination option from the dropdown.
   *
   * @param value - The region ID or surprise me value.
   * @param label - The destination display label.
   */
  const handleSelectOption = (value: number | string, label: string) => {
    if (value === SURPRISE_ME_VALUE) {
      onSurpriseMeSelect();
      setInputValue(SURPRISE_ME_LABEL);
    } else {
      onPlaceSelect(value as number, label);
      setInputValue(label);
    }
    setIsOpen(false);
    onSubmit();
  };

  /**
   * Handles input value change events.
   *
   * @param e - React change event object.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onPlaceChange(val);
    setIsOpen(true);
  };

  /**
   * Clears the selected place value.
   */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onPlaceChange('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="selection-field-container relative">
      <span className="selection-field-label">Where to?</span>
      <div className="form-field-base selection-field-button relative flex items-center">
        <span className="form-field-icon-wrapper">
          <MapPin className="w-5 h-5" strokeWidth={1.5} />
        </span>
        <input
          id="desktop-search-place"
          type="text"
          placeholder="Where to?"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="selection-field-value min-w-0 bg-transparent border-0 outline-none p-0 h-[36px] text-frui-blue font-bold placeholder:text-[#a8a29e]"
        />
        {showClear && inputValue !== '' && (
          <button
            type="button"
            onClick={handleClear}
            className="selection-field-clear-button"
            aria-label="Clear destination"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <DestinationDropdown
          options={options}
          onSelect={handleSelectOption}
          inputValue={inputValue}
        />
      )}
    </div>
  );
};

export default SearchFormPlaceField;
