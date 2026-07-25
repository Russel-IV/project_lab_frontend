import React from 'react';
import { Search } from 'lucide-react';

interface FormSubmitProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const FormSubmit: React.FC<FormSubmitProps> = ({
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <div className="submit-field-container">
      <button
        type="button"
        className={`search-button ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-label="Search"
        title={disabled ? 'Select a destination first' : undefined}
      >
        <Search className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default FormSubmit;
