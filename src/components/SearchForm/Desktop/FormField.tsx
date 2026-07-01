import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onClick,
  icon,
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
        {icon && <span className="form-field-icon-wrapper">{icon}</span>}
        <span className="selection-field-value">{value}</span>
      </button>
    </div>
  );
};

export default FormField;
