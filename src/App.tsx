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
import { Navbar } from '@/components/Navbar';

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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col items-center gap-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Select Date Range
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose a start and end date for your reservation
            </p>
          </div>
          <Popover>
            <PopoverTrigger className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors shadow-xs w-full">
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
        </div>
      </main>
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
