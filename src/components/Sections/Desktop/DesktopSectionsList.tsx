import React from 'react';

interface DesktopSectionsListProps {
  children: React.ReactNode;
}

export const DesktopSectionsList: React.FC<DesktopSectionsListProps> = ({
  children,
}) => {
  return <div className="form-tabs-list">{children}</div>;
};
