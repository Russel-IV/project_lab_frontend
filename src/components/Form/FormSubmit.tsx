import React from 'react';

interface FormSubmitProps {
  label?: string;
  onClick: () => void;
  className?: string;
}

export const FormSubmit: React.FC<FormSubmitProps> = ({
  label = 'Search',
  onClick,
  className = '',
}) => {
  return (
    <div className="submit-field-container">
      <span className="submit-field-label-placeholder">&nbsp;</span>
      <button
        type="button"
        className={`search-button ${className}`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default FormSubmit;
