import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchFormMobile } from './SearchFormMobileContext';
import {
  useDestinations,
  usePopularDestinations,
} from '@/hooks/useDestinations';
import { formatDestinationLabel } from '@/utils/countryName';
import { getRecentSearches, SURPRISE_ME_VALUE } from '../searchFormUtils';
import { SURPRISE_ME_LABEL } from '@/store/searchSlice';

/**
 * Data structure representing a destination item.
 */
interface DestinationOption {
  value: number | string;
  label: string;
}

/**
 * Renders the mobile search form destination selection section.
 */
export const WhereSection: React.FC = () => {
  const {
    localPlace,
    setLocalPlace,
    activeSection,
    setActiveSection,
    handleSelectPlace,
    handleSelectSurpriseMe,
  } = useSearchFormMobile();

  const [inputValue, setInputValue] = useState(localPlace);
  const [prevLocalPlace, setPrevLocalPlace] = useState(localPlace);

  if (localPlace !== prevLocalPlace) {
    setInputValue(localPlace);
    setPrevLocalPlace(localPlace);
  }

  const { destinations: searchResults } = useDestinations(inputValue);
  const { destinations: popularDestinations } = usePopularDestinations();

  const recentSearches = useMemo(() => getRecentSearches(), []);

  const searchOptions: DestinationOption[] = useMemo(
    () =>
      searchResults.map((destination) => ({
        value: destination.regionId,
        label: formatDestinationLabel(
          destination.city,
          destination.countryCode,
        ),
      })),
    [searchResults],
  );

  const popularOptions: DestinationOption[] = useMemo(
    () =>
      popularDestinations.map((destination) => ({
        value: destination.regionId,
        label: formatDestinationLabel(
          destination.city,
          destination.countryCode,
        ),
      })),
    [popularDestinations],
  );

  const recentOptions: DestinationOption[] = useMemo(
    () =>
      recentSearches.map((item) => ({
        value: item.regionId ?? item.label,
        label: item.label,
      })),
    [recentSearches],
  );

  const isExpanded = activeSection === 'where';

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setActiveSection('where')}
        className="bg-frui-white rounded-2xl p-4 flex justify-between items-center shadow-sm cursor-pointer select-none text-left w-full border-0"
      >
        <span className="text-sm text-[#7a7168] font-medium">Where</span>
        <span className="text-sm text-frui-blue font-bold truncate max-w-[200px]">
          {localPlace || 'Around'}
        </span>
      </button>
    );
  }

  /**
   * Handles selecting a destination from recent or suggestion lists.
   *
   * @param option - The selected destination option object.
   */
  const handleOptionClick = (option: DestinationOption) => {
    if (option.value === SURPRISE_ME_VALUE) {
      handleSelectSurpriseMe();
      setInputValue(SURPRISE_ME_LABEL);
    } else {
      const regionId =
        typeof option.value === 'number' ? option.value : undefined;
      handleSelectPlace(option.label, regionId);
      setInputValue(option.label);
    }
  };

  /**
   * Handles text input changes.
   *
   * @param e - Input change event object.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setLocalPlace(val);
  };

  /**
   * Clears the current input text.
   */
  const handleClear = () => {
    setInputValue('');
    setLocalPlace('');
  };

  return (
    <div className="bg-frui-white rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-frui-blue">Where?</h2>

      {/* Input container */}
      <div className="relative flex items-center border border-[#d6c7b9] rounded-2xl px-3.5 py-3 bg-frui-white">
        <Search className="w-5 h-5 text-[#7a7168] shrink-0 mr-3" />
        <input
          id="mobile-search-place"
          type="text"
          placeholder="Search destinations"
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          className="w-full bg-transparent text-sm font-semibold text-frui-blue placeholder:text-[#a8a29e] outline-none"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-[#7a7168] hover:text-frui-blue shrink-0 cursor-pointer ml-2"
            aria-label="Clear text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Inline list content */}
      <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-1">
        {inputValue.trim() ? (
          /* Search Results */
          <div>
            <span className="block text-xs font-semibold text-[#7a7168] mb-2">
              Search results
            </span>
            {searchOptions.length === 0 ? (
              <div className="py-3 text-xs text-[#7a7168] italic">
                No stays found matching &quot;{inputValue}&quot;
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {searchOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className="w-full flex flex-col p-2.5 rounded-xl text-left hover:bg-frui-cream transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-frui-blue truncate">
                      {option.label}
                    </span>
                    <span className="text-xs text-[#7a7168]">Destination</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {recentOptions.length > 0 && (
              <div>
                <span className="block text-xs font-semibold text-[#7a7168] mb-2">
                  Recent searches
                </span>
                <div className="flex flex-col gap-1">
                  {recentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className="w-full flex flex-col p-2.5 rounded-xl text-left hover:bg-frui-cream transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-frui-blue truncate">
                        {option.label}
                      </span>
                      <span className="text-xs text-[#7a7168]">
                        Recent search
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Destination Suggestions */}
            <div>
              <span className="block text-xs font-semibold text-[#7a7168] mb-2">
                Destination suggestions
              </span>
              <div className="flex flex-col gap-1">
                {/* Surprise me / Nearby */}
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick({
                      value: SURPRISE_ME_VALUE,
                      label: SURPRISE_ME_LABEL,
                    })
                  }
                  className="w-full flex flex-col p-2.5 rounded-xl text-left hover:bg-frui-cream transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-frui-blue">
                    {SURPRISE_ME_LABEL}
                  </span>
                  <span className="text-xs text-[#7a7168]">
                    Discover your next destination
                  </span>
                </button>

                {/* Popular destinations */}
                {popularOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className="w-full flex flex-col p-2.5 rounded-xl text-left hover:bg-frui-cream transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-frui-blue truncate">
                      {option.label}
                    </span>
                    <span className="text-xs text-[#7a7168]">
                      Popular destination
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WhereSection;
