import React, { useState } from 'react';
import { BedDouble, Plane, Car, Ticket, Ship } from 'lucide-react';
import './Sections.css';
import { MobileSectionsList, MobileSectionsItem } from './Mobile';
import { DesktopSectionsList, DesktopSectionsItem } from './Desktop';

const tabs = [
  { id: 'stays', label: 'STAYS', icon: BedDouble },
  { id: 'flights', label: 'FLIGHTS', icon: Plane },
  { id: 'cars', label: 'CARS', icon: Car },
  { id: 'things', label: 'THINGS TO DO', icon: Ticket },
  { id: 'cruises', label: 'CRUISES', icon: Ship },
];

/**
 * Sections
 *
 * Exposes a tabbed navigation bar for selecting stay categories (Stays, Flights, etc.).
 * Manages its own local active selection state.
 */
export const Sections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('stays');

  return (
    <DesktopSectionsList>
      {tabs.map(({ id, label, icon }) => (
        <DesktopSectionsItem
          key={id}
          active={activeTab === id}
          onClick={() => setActiveTab(id)}
          icon={icon}
          label={label}
        />
      ))}
    </DesktopSectionsList>
  );
};

/**
 * MobileSections
 *
 * Exposes a mobile-specific tabbed navigation bar for stay categories.
 * Renders horizontally scrollable pill buttons using a composable pattern.
 */
export const MobileSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('stays');

  return (
    <MobileSectionsList>
      {tabs.map(({ id, label, icon }) => (
        <MobileSectionsItem
          key={id}
          active={activeTab === id}
          onClick={() => setActiveTab(id)}
          icon={icon}
          label={label}
        />
      ))}
    </MobileSectionsList>
  );
};

export default Sections;
