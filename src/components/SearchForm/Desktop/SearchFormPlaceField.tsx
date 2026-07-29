import { useMemo, useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { useSearchForm } from './SearchFormContext';
import { InputGroupAddon } from '@/components/ui/input-group';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';
import {
  useDestinations,
  usePopularDestinations,
} from '@/hooks/useDestinations';
import { formatDestinationLabel } from '@/utils/countryName';
import { SURPRISE_ME_VALUE } from '../searchFormUtils';
import { SURPRISE_ME_LABEL } from '@/store/searchSlice';

export const SearchFormPlaceField: React.FC<{ showClear?: boolean }> = ({
  showClear = true,
}) => {
  const {
    placeValue,
    placeRegionId,
    isSurpriseMe,
    onPlaceChange,
    onPlaceSelect,
    onSurpriseMeSelect,
  } = useSearchForm();
  const [inputValue, setInputValue] = useState(placeValue);
  const [prevPlaceValue, setPrevPlaceValue] = useState(placeValue);

  if (placeValue !== prevPlaceValue) {
    setInputValue(placeValue);
    setPrevPlaceValue(placeValue);
  }

  const { destinations: searchResults } = useDestinations(inputValue);
  const { destinations: popularDestinations } = usePopularDestinations();
  const destinations = inputValue.trim() ? searchResults : popularDestinations;

  const options = useMemo(
    () =>
      destinations.map((destination) => ({
        value: destination.regionId as number | string,
        label: formatDestinationLabel(
          destination.city,
          destination.countryCode,
        ),
      })),
    [destinations],
  );

  const allOptions = useMemo(
    () => [{ value: SURPRISE_ME_VALUE, label: SURPRISE_ME_LABEL }, ...options],
    [options],
  );

  return (
    <div className="selection-field-container">
      <span className="selection-field-label">Where to?</span>
      <Combobox<number | string>
        items={allOptions}
        value={isSurpriseMe ? SURPRISE_ME_VALUE : placeRegionId}
        onValueChange={(value) => {
          if (value == null) return;
          if (value === SURPRISE_ME_VALUE) {
            onSurpriseMeSelect();
            setInputValue(SURPRISE_ME_LABEL);
            return;
          }
          const picked = options.find((option) => option.value === value);
          if (!picked) return;
          onPlaceSelect(picked.value as number, picked.label);
          setInputValue(picked.label);
        }}
        inputValue={inputValue}
        onInputValueChange={(val, eventDetails) => {
          if (
            eventDetails.reason === 'item-press' ||
            eventDetails.reason === 'none'
          ) {
            return;
          }
          setInputValue(val);
          onPlaceChange(val);
        }}
      >
        <ComboboxInput
          id="desktop-search-place"
          showClear={showClear && placeValue !== ''}
          placeholder={'Where to?'}
          className="form-field-base combobox-field h-[36px]"
        >
          <InputGroupAddon align="inline-start">
            <span className="form-field-icon-wrapper">
              <MapPin className="w-4 h-4" strokeWidth={2} />
            </span>
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent
          className="z-50 min-w-[320px] bg-white border border-[#d6c7b9] rounded-lg shadow-xl p-1 text-[#121324]"
          collisionAvoidance={{ side: 'none' }}
        >
          <ComboboxEmpty className="px-3 py-2.5 text-xs text-[#7a7168] italic">
            No stays found matching
          </ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem
                key={option.value}
                value={option.value}
                className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm text-[#121324] hover:bg-[#f7f4f2] rounded transition-colors duration-150"
              >
                {option.value === SURPRISE_ME_VALUE ? (
                  <Sparkles className="h-4 w-4 text-[#e8660d] shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 text-[#7a7168] shrink-0" />
                )}
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default SearchFormPlaceField;
