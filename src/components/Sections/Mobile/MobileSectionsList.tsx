import React from 'react';

interface MobileSectionsListProps {
  children: React.ReactNode;
}

/**
 * MobileSectionsList
 *
 * A horizontal scrollable flexbox container for rendering category tabs on mobile devices.
 * Uses custom scrollbar hiding utility class.
 *
 * @param props.children - Child tab buttons to render inside the flex container.
 */
export const MobileSectionsList: React.FC<MobileSectionsListProps> = ({
  children,
}) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto py-3 px-4 scrollbar-none items-center w-full border-b border-frui-blue/10 select-none">
      {children}
    </div>
  );
};
