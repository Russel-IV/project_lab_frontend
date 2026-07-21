import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
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

export const SearchFormPlaceField: React.FC<{ showClear?: boolean }> = ({
  showClear = true,
}) => {
  const { placeValue, placeRegionId, onPlaceChange, onPlaceSelect } =
    useSearchForm();
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
        value: destination.regionId,
        label: formatDestinationLabel(
          destination.city,
          destination.countryCode,
        ),
      })),
    [destinations],
  );

  return (
    <div className="selection-field-container place-field-container">
      <span className="selection-field-label">Where to?</span>
      <Combobox
        items={options}
        value={placeRegionId}
        onValueChange={(regionId) => {
          if (regionId == null) return;
          const picked = options.find((option) => option.value === regionId);
          if (!picked) return;
          onPlaceSelect(picked.value, picked.label);
          // Set the input text ourselves rather than relying on base-ui's
          // own post-selection label resolution, which can fall back to
          // stringifying the raw regionId if `options` doesn't contain a
          // match at the exact moment it runs internally.
          setInputValue(picked.label);
        }}
        inputValue={inputValue}
        onInputValueChange={(val, eventDetails) => {
          // base-ui fires this with reason "item-press" and, oddly, again
          // with "none" right after a selection, both times trying to
          // resync the controlled input text - sometimes with an
          // unresolved raw value instead of the label. We already set the
          // correct text ourselves in onValueChange above, so ignore both.
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
          placeholder={'Where are we going?'}
          className="form-field-base combobox-field"
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
                <MapPin className="h-4 w-4 text-[#7a7168] shrink-0" />
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
