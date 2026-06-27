import React, { useMemo } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useSearchFormMobile } from './SearchFormMobileContext';

// Standard options from the existing desktop dropdown
const standardOptions = [
  'US, New York',
  'US, Los Angeles',
  'US, Chicago',
  'US, Houston',
  'US, Phoenix',
  'US, Philadelphia',
  'US, San Antonio',
  'US, San Diego',
  'US, Dallas',
  'US, San Jose',
];

/**
 * WhereSection
 *
 * Renders the "Where?" input and suggestion list.
 * Supports collapsed and expanded accordion modes.
 */
export const WhereSection: React.FC = () => {
  const {
    localPlace,
    setLocalPlace,
    activeSection,
    setActiveSection,
    handleSelectPlace,
  } = useSearchFormMobile();

  // Load recent searches from localStorage (JSON array of strings)
  const recentSearches = useMemo<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recent_searches') || '[]');
    } catch (e) {
      console.log(e);
      return [];
    }
  }, []);

  const filteredStandardOptions = useMemo(() => {
    if (!localPlace) return [];
    return standardOptions.filter((opt) =>
      opt.toLowerCase().includes(localPlace.toLowerCase()),
    );
  }, [localPlace]);

  const isExpanded = activeSection === 'where';

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setActiveSection('where')}
        className="bg-frui-white rounded-2xl p-4 flex justify-between items-center shadow-sm cursor-pointer select-none text-left w-full border-0"
      >
        <span className="text-sm text-[#877D74] font-medium">Where</span>
        <span className="text-sm text-frui-blue font-bold truncate max-w-[200px]">
          {localPlace || 'Around'}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-frui-white rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-frui-blue">Where?</h2>
      <div className="relative flex items-center border border-[#d6c7b9] rounded-2xl bg-frui-white px-3 py-3">
        <Search className="h-5 w-5 text-[#877D74] mr-3" />
        <input
          type="text"
          value={localPlace}
          onChange={(e) => setLocalPlace(e.target.value)}
          placeholder="Where do you want to go?"
          className="w-full bg-transparent border-0 p-0 text-sm font-medium text-frui-blue outline-none placeholder-[#A8A29E]"
        />
        {localPlace && (
          <button
            type="button"
            onClick={() => setLocalPlace('')}
            className="p-1 rounded-full text-[#877D74] hover:bg-neutral-100 cursor-pointer border-0 bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* List suggestions */}
      <div className="overflow-y-auto max-h-[360px] flex flex-col gap-4 pr-1 mt-2">
        {!localPlace && recentSearches.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#877D74]">
              Recent searches
            </span>
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPlace(item)}
                className="flex items-center gap-3 text-left w-full cursor-pointer py-1 border-0 bg-transparent"
              >
                <MapPin className="h-5 w-5 text-[#877D74] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-frui-blue">
                    {item}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {localPlace && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#877D74]">
              Search's results
            </span>
            {filteredStandardOptions.map((opt, idx) => (
              <button
                key={`opt-${idx}`}
                type="button"
                onClick={() => handleSelectPlace(opt)}
                className="flex items-center gap-3 text-left w-full cursor-pointer py-1 border-0 bg-transparent"
              >
                <MapPin className="h-5 w-5 text-[#877D74] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-frui-blue">
                    {opt}
                  </span>
                </div>
              </button>
            ))}

            {filteredStandardOptions.length === 0 && (
              <span className="text-xs text-[#877D74] italic py-2">
                Can't find any match
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhereSection;
