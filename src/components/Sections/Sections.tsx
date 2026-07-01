import React, { useState } from 'react';
import { BedDouble, Plane, Car, Ticket, Ship } from 'lucide-react';
import './Sections.css';

/**
 * Sections
 *
 * Exposes a tabbed navigation bar for selecting stay categories (Stays, Flights, etc.).
 * Manages its own local active selection state.
 */
export const Sections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('stays');

  const tabs = [
    { id: 'stays', label: 'STAYS', icon: BedDouble },
    { id: 'flights', label: 'FLIGHTS', icon: Plane },
    { id: 'cars', label: 'CARS', icon: Car },
    { id: 'things', label: 'THINGS TO DO', icon: Ticket },
    { id: 'cruises', label: 'CRUISES', icon: Ship },
  ];

  return (
    <div className="form-tabs-list">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            className={`form-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon className="form-tab-icon" strokeWidth={isActive ? 2 : 1.5} />
            <span className="form-tab-text">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Sections;
