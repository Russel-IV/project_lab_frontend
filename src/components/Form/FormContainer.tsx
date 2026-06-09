import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <div className="form-component-wrapper">
      <div className="form-card">{children}</div>
    </div>
  );
};

export default FormContainer;
