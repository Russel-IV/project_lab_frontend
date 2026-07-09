import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PoliciesSection, type PoliciesSectionStay } from './PoliciesSection';

const baseStay: PoliciesSectionStay = {
  isRefundable: true,
  daysFromBookingCancellationDeadline: 3,
  policiesText: null,
  importantInformation: null,
  checkInTimeFrom: '15:00',
  checkInTimeUntil: '22:00',
  checkOutTime: '11:00',
  allowsPets: true,
  allowsSmoking: false,
  allowsParties: false,
  houseRulesText: 'Quiet hours after 10pm',
};

describe('PoliciesSection', () => {
  it('renders check-in/check-out times with the flexibility window', () => {
    render(<PoliciesSection stay={baseStay} checkIn="2026-08-10" />);
    expect(
      screen.getByText('Check-in from 3:00 PM, until 10:00 PM'),
    ).toBeInTheDocument();
    expect(screen.getByText('Check-out before 11:00 AM')).toBeInTheDocument();
  });

  it('omits the check-in/check-out row when times are missing (pre-backfill stay)', () => {
    render(
      <PoliciesSection
        stay={{
          ...baseStay,
          checkInTimeFrom: null,
          checkInTimeUntil: null,
          checkOutTime: null,
        }}
        checkIn="2026-08-10"
      />,
    );
    expect(screen.queryByText('Check-in / Check-out')).not.toBeInTheDocument();
  });

  it('renders the plain-language cancellation policy', () => {
    render(<PoliciesSection stay={baseStay} checkIn="2026-08-10" />);
    expect(
      screen.getByText('Free cancellation before August 7'),
    ).toBeInTheDocument();
  });

  it('renders "Non-refundable" for a non-refundable stay', () => {
    render(
      <PoliciesSection
        stay={{ ...baseStay, isRefundable: false }}
        checkIn="2026-08-10"
      />,
    );
    expect(screen.getByText('Non-refundable')).toBeInTheDocument();
  });

  it('lists house rules and free-text house rule bullets', () => {
    render(<PoliciesSection stay={baseStay} checkIn="2026-08-10" />);
    expect(screen.getByText('Pets')).toBeInTheDocument();
    expect(screen.getByText('No smoking')).toBeInTheDocument();
    expect(screen.getByText('No parties')).toBeInTheDocument();
    expect(screen.getByText('Quiet hours after 10pm')).toBeInTheDocument();
  });
});
