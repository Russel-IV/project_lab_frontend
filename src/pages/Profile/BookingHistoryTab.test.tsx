import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MY_BOOKINGS, DELETE_BOOKING } from '@/graphql/bookings';
import type { BookingStatus } from '@/types/__generated__/graphql';
import { BookingHistoryTab } from './BookingHistoryTab';

function bookingsMock(
  bookings: Array<{
    id: number;
    checkInDate: string;
    checkOutDate: string;
    status: BookingStatus;
    guestsCount: number;
    totalPrice: number;
    rooms: Array<{ id: number; stayId: number; name: string }>;
  }>,
): MockedResponse {
  return {
    request: { query: MY_BOOKINGS, variables: { page: 0, size: 50 } },
    result: {
      data: {
        myBookings: bookings.map((b) => ({
          __typename: 'Booking' as const,
          createdAt: '2026-01-01',
          ...b,
          rooms: b.rooms.map((r) => ({ __typename: 'Room' as const, ...r })),
        })),
      },
    },
  };
}

function renderWithProviders(mocks: MockedResponse[]) {
  return render(
    <MemoryRouter>
      <MockedProvider mocks={mocks}>
        <BookingHistoryTab />
      </MockedProvider>
    </MemoryRouter>,
  );
}

describe('BookingHistoryTab', () => {
  it('shows an empty state when there are no bookings', async () => {
    renderWithProviders([bookingsMock([])]);
    expect(
      await screen.findByText("You haven't made any bookings yet."),
    ).toBeInTheDocument();
  });

  it('lists bookings with dates, guests, price and status', async () => {
    renderWithProviders([
      bookingsMock([
        {
          id: 1,
          checkInDate: '2026-08-01',
          checkOutDate: '2026-08-05',
          status: 'CONFIRMED',
          guestsCount: 2,
          totalPrice: 400,
          rooms: [{ id: 10, stayId: 99, name: 'Deluxe Room' }],
        },
      ]),
    ]);

    expect(await screen.findByText('Deluxe Room')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('2 guests · $ 400 USD')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View stay' })).toHaveAttribute(
      'href',
      '/stay/99',
    );
  });

  it('only shows the cancel action for pending/confirmed bookings', async () => {
    renderWithProviders([
      bookingsMock([
        {
          id: 1,
          checkInDate: '2026-08-01',
          checkOutDate: '2026-08-05',
          status: 'CONFIRMED',
          guestsCount: 1,
          totalPrice: 200,
          rooms: [{ id: 10, stayId: 99, name: 'Room A' }],
        },
        {
          id: 2,
          checkInDate: '2025-01-01',
          checkOutDate: '2025-01-05',
          status: 'COMPLETED',
          guestsCount: 1,
          totalPrice: 200,
          rooms: [{ id: 11, stayId: 98, name: 'Room B' }],
        },
      ]),
    ]);

    expect(await screen.findByText('Room A')).toBeInTheDocument();
    expect(screen.getByText('Room B')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Cancel booking' }),
    ).toHaveLength(1);
  });

  it('cancels a booking after confirming the dialog', async () => {
    const user = userEvent.setup();
    const mocks = [
      bookingsMock([
        {
          id: 1,
          checkInDate: '2026-08-01',
          checkOutDate: '2026-08-05',
          status: 'PENDING',
          guestsCount: 1,
          totalPrice: 150,
          rooms: [{ id: 10, stayId: 99, name: 'Room A' }],
        },
      ]),
      {
        request: { query: DELETE_BOOKING, variables: { id: 1 } },
        result: { data: { deleteBooking: true } },
      },
      bookingsMock([]),
    ];

    renderWithProviders(mocks);

    await user.click(
      await screen.findByRole('button', { name: 'Cancel booking' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(
      within(dialog).getByRole('button', { name: 'Cancel booking' }),
    );

    expect(
      await screen.findByText("You haven't made any bookings yet."),
    ).toBeInTheDocument();
  });
});
