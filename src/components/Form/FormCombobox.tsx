import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { InputGroupAddon } from '@/components/ui/input-group';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
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
  showClear = true,
}) => {
  const [inputValue, setInputValue] = useState('');

  const options = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
  ];

  return (
    <div className="selection-field-container">
      <span className="selection-field-label">{label}</span>
      <Combobox
        items={options}
        value={value}
        onValueChange={(val) => onValueChange(val ?? '')}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
      >
        <ComboboxInput
          showClear={showClear && value !== ''}
          placeholder={'Where are we going?'}
          className="form-field-base combobox-field"
        >
          <InputGroupAddon align="inline-start">
            <MapPin className="text-[#877D74] w-5 h-5 mr-3" strokeWidth={1.5} />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent
          className="z-50 bg-white border border-[#d6c7b9] rounded-lg shadow-xl p-1 text-[#121324]"
          collisionAvoidance={{ side: 'none' }}
        >
          <ComboboxEmpty className="px-3 py-2.5 text-xs text-[#877d74] italic">
            No stays found matching
          </ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem
                key={option}
                value={option}
                className="cursor-pointer px-3 py-2 text-sm text-[#121324] hover:bg-[#f7f4f2] rounded transition-colors duration-150"
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

export default FormCombobox;
