import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onClick: () => void;
  showIcon?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onClick,
  showIcon = false,
}) => {
  return (
    <div className="selection-field-container">
      <span className="selection-field-label">{label}</span>
      <button
        type="button"
        className="form-field-base selection-field-button"
        onClick={onClick}
        aria-label={`Cycle options for ${label}`}
      >
        <span className="selection-field-value">{value}</span>
        {showIcon && (
          <svg
            className="selection-field-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M9 1v2h6V1h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2zm11 7H4v12h16V8zm-2 3v2h-2v-2h2zm-5 0v2H9v-2h2zm-5 0v2H4v-2h2zm10 4v2h-2v-2h2zm-5 0v2H9v-2h2zm-5 0v2H4v-2h2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FormField;
