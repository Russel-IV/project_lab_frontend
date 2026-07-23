import React from 'react';

interface MobileSectionsListProps {
  children: React.ReactNode;
}

export const MobileSectionsList: React.FC<MobileSectionsListProps> = ({
  children,
}) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto py-3 px-4 scrollbar-none items-center w-full border-b border-frui-blue/10 select-none">
      {children}
    </div>
  );
};
