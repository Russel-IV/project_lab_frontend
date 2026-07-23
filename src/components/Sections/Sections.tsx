import React, { useState } from 'react';
import { BedDouble, Plane, Car, Ticket, Ship } from 'lucide-react';
import './Sections.css';
import { MobileSectionsList, MobileSectionsItem } from './Mobile';
import { DesktopSectionsList, DesktopSectionsItem } from './Desktop';

const tabs = [
  { id: 'stays', label: 'STAYS', icon: BedDouble, disabled: false },
  { id: 'flights', label: 'FLIGHTS', icon: Plane, disabled: true },
  { id: 'cars', label: 'CARS', icon: Car, disabled: true },
  { id: 'things', label: 'THINGS TO DO', icon: Ticket, disabled: true },
  { id: 'cruises', label: 'CRUISES', icon: Ship, disabled: true },
];

export const Sections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('stays');

  return (
    <DesktopSectionsList>
      {tabs.map(({ id, label, icon, disabled }) => (
        <DesktopSectionsItem
          key={id}
          active={activeTab === id}
          onClick={() => setActiveTab(id)}
          icon={icon}
          label={label}
          disabled={disabled}
        />
      ))}
    </DesktopSectionsList>
  );
};

export const MobileSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('stays');

  return (
    <MobileSectionsList>
      {tabs.map(({ id, label, icon, disabled }) => (
        <MobileSectionsItem
          key={id}
          active={activeTab === id}
          onClick={() => setActiveTab(id)}
          icon={icon}
          label={label}
          disabled={disabled}
        />
      ))}
    </MobileSectionsList>
  );
};

export default Sections;
