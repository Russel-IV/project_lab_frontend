import React, { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useSearchFormMobile } from './SearchFormMobileContext';
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
import { getRecentSearches } from '../searchFormUtils';

interface DestinationOption {
  value: number | string;
  label: string;
}

/**
 * WhereSection
 *
 * Renders the "Where?" input and suggestion list.
 * Supports collapsed and expanded accordion modes.
 */
export const WhereSection: React.FC = () => {
  const {
    localPlace,
    localPlaceRegionId,
    setLocalPlace,
    activeSection,
    setActiveSection,
    handleSelectPlace,
  } = useSearchFormMobile();

  // Decoupled from `localPlace` (the committed selection) so that typing
  // drives the Combobox's filter query independently - mirroring Desktop's
  // SearchFormPlaceField, binding both to the same state confuses the
  // library's internal value-vs-query tracking and silently breaks filtering.
  const [inputValue, setInputValue] = useState(localPlace);
  const [prevLocalPlace, setPrevLocalPlace] = useState(localPlace);

  if (localPlace !== prevLocalPlace) {
    setInputValue(localPlace);
    setPrevLocalPlace(localPlace);
  }

  const { destinations: searchResults } = useDestinations(inputValue);
  const { destinations: popularDestinations } = usePopularDestinations();

  // Recent searches (JSON array of { label, regionId? } in localStorage).
  const recentSearches = useMemo(() => getRecentSearches(), []);

  const destinationOptions: DestinationOption[] = useMemo(
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

  // Recents were saved as { label, regionId? } - not cross-checked against
  // live destinations, since a recent search should stay selectable even if
  // it's no longer a known destination.
  const recentOptions: DestinationOption[] = useMemo(
    () =>
      recentSearches.map((item) => ({
        value: item.regionId ?? item.label,
        label: item.label,
      })),
    [recentSearches],
  );

  const showRecents = !inputValue && recentOptions.length > 0;
  const items: DestinationOption[] = showRecents
    ? recentOptions
    : inputValue.trim()
      ? destinationOptions
      : popularOptions;
  const groupLabel = showRecents
    ? 'Recent searches'
    : inputValue
      ? "Search's results"
      : 'Suggestions';

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

  return (
    <div className="bg-frui-white rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-frui-blue">Where?</h2>
      <Combobox<number | string>
        items={items}
        value={localPlaceRegionId ?? (localPlace || null)}
        onValueChange={(val) => {
          if (val == null) return;
          const picked = items.find((option) => option.value === val);
          if (!picked) return;
          // Recent entries without a regionId carry their label as `value`
          // (see recentOptions above) - only pass a real numeric regionId.
          const regionId =
            typeof picked.value === 'number' ? picked.value : undefined;
          handleSelectPlace(picked.label, regionId);
          // Set the input text ourselves rather than relying on base-ui's
          // own post-selection label resolution, which can fall back to
          // stringifying the raw value if `items` doesn't contain a match
          // at the exact moment it runs internally.
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
          setLocalPlace(val);
        }}
      >
        <ComboboxInput
          id="mobile-search-place"
          showClear={inputValue !== ''}
          placeholder="Where do you want to go?"
          className="form-field-base combobox-field !rounded-2xl !border !border-[#d6c7b9] !bg-frui-white !px-3 !py-3"
        >
          <InputGroupAddon align="inline-start">
            <span className="form-field-icon-wrapper">
              <MapPin className="w-4 h-4" strokeWidth={2} />
            </span>
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent
          className="w-(--anchor-width) max-h-[360px] bg-white border border-[#d6c7b9] rounded-2xl shadow-xl p-2"
          positionerClassName="z-[110]"
          sideOffset={8}
        >
          {items.length > 0 && (
            <span className="block px-1 pb-2 text-xs font-bold text-[#7a7168]">
              {groupLabel}
            </span>
          )}
          <ComboboxEmpty className="px-1 py-2 text-xs text-[#7a7168] italic">
            Can&apos;t find any match
          </ComboboxEmpty>
          <ComboboxList className="flex flex-col gap-1">
            {(option) => (
              <ComboboxItem
                key={option.value}
                value={option.value}
                className="flex items-center gap-3 text-left w-full cursor-pointer py-2 px-1 rounded-lg hover:bg-[#f7f4f2]"
              >
                <MapPin className="h-5 w-5 text-[#7a7168] shrink-0" />
                <span className="text-sm font-bold text-frui-blue">
                  {option.label}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default WhereSection;
