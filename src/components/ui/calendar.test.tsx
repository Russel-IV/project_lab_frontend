import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './calendar';
import { describe, it, expect, vi } from 'vitest';

describe('Calendar Component', () => {
  it('renders correctly', () => {
    const { container } = render(<Calendar mode="single" />);

    // Check that the calendar main container is present in the DOM
    const calendarContainer = container.querySelector('[data-slot="calendar"]');
    expect(calendarContainer).toBeInTheDocument();
  });

  it('renders multiple months when numberOfMonths is specified', () => {
    const { container } = render(<Calendar mode="range" numberOfMonths={2} />);

    // When numberOfMonths is 2, check that two month grids are rendered
    const monthGrids = container.querySelectorAll('.rdp-month');
    expect(monthGrids.length).toBe(2);
  });

  it('triggers onSelect when a day is clicked', async () => {
    const handleSelect = vi.fn();
    const today = new Date();

    render(<Calendar mode="single" selected={today} onSelect={handleSelect} />);

    // Get all buttons inside the calendar
    const buttons = screen.getAllByRole('button');

    // Find an enabled day button (which will just have a number as its text)
    const dayButton = buttons.find((btn) => {
      const text = btn.textContent || '';
      return /^\d+$/.test(text) && !btn.hasAttribute('disabled');
    });

    expect(dayButton).toBeDefined();

    if (dayButton) {
      await userEvent.click(dayButton);
      expect(handleSelect).toHaveBeenCalled();
    }
  });
});
