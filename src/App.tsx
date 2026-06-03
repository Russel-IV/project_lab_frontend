import React from 'react';
import SearchForm from './components/Form/SearchForm';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import './App.css';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

function App() {
  const [date, setDate] = useState<DateRange | undefined>();

  const handleSelect = (newRange: DateRange | undefined) => {
    const isCompleteRange =
      date?.from && date?.to && date.from.getTime() !== date.to.getTime();

    if (isCompleteRange) {
      setDate(undefined);
    } else {
      setDate(newRange);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="app-container p-8">
      <Popover>
        <PopoverTrigger>
          {date?.from
            ? date.to
              ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
              : date.from.toLocaleDateString()
            : 'Pick a date'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ before: today }}
          />
        </PopoverContent>
      </Popover>
      <div className="app-container">
        {/* Top bar with deep dark blue background */}
        <header className="app-header" aria-label="Main Header"></header>

        {/* Main section with light mint green background */}
        <main className="app-main">
          <section className="form-section">
            <SearchForm />
          </section>
        </main>

        {/* Bottom area with solid grass-green background */}
        <footer className="app-footer" aria-label="Main Footer"></footer>
      </div>
    </div>
  );
}

export default App;
