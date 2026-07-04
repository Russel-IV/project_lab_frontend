import React from 'react';
import { Search } from 'lucide-react';

interface FormSubmitProps {
  onClick: () => void;
  className?: string;
}

export const FormSubmit: React.FC<FormSubmitProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <div className="submit-field-container">
      <button
        type="button"
        className={`search-button ${className}`}
        onClick={onClick}
        aria-label="Search"
      >
        <Search className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default FormSubmit;
