import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onClick: () => void;
  icon?: React.ReactNode;
  isActive?: boolean;
}

/**
 * FormField component renders an input field segment with label, value, icon, and active status.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onClick,
  icon,
  isActive = false,
}) => {
  return (
    <div className={`selection-field-container ${isActive ? 'is-active' : ''}`}>
      <span className="selection-field-label">{label}</span>
      <button
        type="button"
        className="form-field-base selection-field-button"
        onClick={onClick}
        aria-label={`${label}: ${value}. Activate to cycle options.`}
      >
        {icon && <span className="form-field-icon-wrapper">{icon}</span>}
        <span className="selection-field-value">{value}</span>
      </button>
    </div>
  );
};

export default FormField;
