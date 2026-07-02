import React from 'react';

interface DesktopSectionsListProps {
  children: React.ReactNode;
}

/**
 * DesktopSectionsList
 *
 * Container component for desktop category navigation tabs.
 * Uses styling from Sections.css (.form-tabs-list).
 *
 * @param props.children - Direct children buttons to render.
 */
export const DesktopSectionsList: React.FC<DesktopSectionsListProps> = ({
  children,
}) => {
  return <div className="form-tabs-list">{children}</div>;
};
