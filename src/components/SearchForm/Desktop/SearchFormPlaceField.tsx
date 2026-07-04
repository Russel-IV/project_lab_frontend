import { useState } from 'react';
import { useSearchForm } from './SearchFormContext';
import { cn } from '@/lib/utils';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';

interface SearchFormPlaceFieldProps {
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  showClear?: boolean;
}

export const SearchFormPlaceField: React.FC<SearchFormPlaceFieldProps> = ({
  isActive,
  onActivate,
  onDeactivate,
  showClear = true,
}) => {
  const { placeValue, onPlaceChange } = useSearchForm();
  const [inputValue, setInputValue] = useState(placeValue);
  const [prevPlaceValue, setPrevPlaceValue] = useState(placeValue);

  if (placeValue !== prevPlaceValue) {
    setInputValue(placeValue);
    setPrevPlaceValue(placeValue);
  }

  const options = [
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

  return (
    <div
      onClick={onActivate}
      className={cn(
        'flex flex-col flex-[1.2] px-4 xl:px-8 py-2.5 xl:py-3 rounded-full cursor-pointer justify-center min-w-0 transition-all duration-150 select-none',
        isActive
          ? 'bg-frui-white shadow-[0_3px_12px_rgba(0,0,0,0.08)]'
          : 'bg-transparent',
      )}
    >
      <span className="text-[10px] xl:text-xs font-bold text-frui-blue uppercase tracking-wider select-none mb-0.5">
        Where
      </span>
      <Combobox
        open={isActive}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            onActivate();
          } else {
            onDeactivate();
          }
        }}
        items={options}
        value={placeValue}
        onValueChange={(val) => onPlaceChange(val ?? '')}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
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
          className="z-50 bg-frui-white border border-[#d6c7b9]/50 rounded-2xl shadow-xl p-2 text-frui-blue min-w-[250px]"
          collisionAvoidance={{ side: 'none' }}
        >
          <ComboboxEmpty className="px-3 py-2 text-xs text-gray-500 italic">
            No stays found matching
          </ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem
                key={option}
                value={option}
                className="cursor-pointer px-4 py-2 text-sm text-frui-blue hover:bg-frui-cream rounded-xl transition-colors duration-150"
              >
                {option}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default SearchFormPlaceField;
