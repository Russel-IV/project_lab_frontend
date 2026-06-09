import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { InputGroupAddon } from '@/components/ui/input-group';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox';

interface FormComboboxProps {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  showClear?: boolean;
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
  label,
  value,
  onValueChange,
  options,
  showClear = true,
}) => {
  const [inputValue, setInputValue] = useState('');

  // Filter options based on lowercase text input matches
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="selection-field-container">
      <span className="selection-field-label">{label}</span>
      <Combobox
        value={value}
        onValueChange={(val) => onValueChange(val ?? '')}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
      >
        <ComboboxInput
          showClear={showClear && value !== ''}
          placeholder={'Where do you want to enjoy?'}
          className="form-field-base combobox-field"
        >
          <InputGroupAddon align="inline-start" className="pl-3">
            <MapPin className="text-[#877D74] w-5 h-5" strokeWidth={1.5} />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent className="z-50 bg-[#121324] border border-[#2e303a] rounded-lg shadow-xl p-1 text-white">
          <ComboboxList>
            {filteredOptions.map((option) => (
              <ComboboxItem
                key={option}
                value={option}
                className="cursor-pointer px-3 py-2 text-sm text-gray-200 hover:bg-[#2e303a] rounded transition-colors duration-150"
              >
                {option}
              </ComboboxItem>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2.5 text-xs text-muted-foreground italic">
                No stays found matching "{inputValue}"
              </div>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default FormCombobox;
