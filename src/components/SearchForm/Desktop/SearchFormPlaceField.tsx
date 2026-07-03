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
          placeholder="Search destinations"
          showTrigger={false}
          className="!border-none !shadow-none !ring-0 !bg-transparent h-5 w-full p-0 flex items-center [&_input]:text-xs [&_input]:xl:text-sm [&_input]:text-frui-blue [&_input]:placeholder:text-gray-400 [&_input]:font-medium [&_input]:h-auto [&_input]:p-0 [&_input]:outline-none [&_input]:ring-0 [&_[data-slot=input-group-addon]]:py-0"
        />
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
