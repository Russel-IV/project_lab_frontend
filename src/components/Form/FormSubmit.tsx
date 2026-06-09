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
    <div className="form-actions">
      <button
        type="button"
        className={`search-button !bg-[#E8660D] !text-white ${className}`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default FormSubmit;
