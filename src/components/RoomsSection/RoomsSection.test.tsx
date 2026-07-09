import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import { AVAILABLE_ROOMS } from '@/graphql/stays';
import { RoomsSection, type RoomsSectionRoom } from './RoomsSection';

const STAY_ID = 100;
const CHECK_IN = '2026-08-10';
const CHECK_OUT = '2026-08-12';

const room = (overrides: Partial<RoomsSectionRoom>): RoomsSectionRoom => ({
  __typename: 'Room',
  id: 1,
  stayId: STAY_ID,
  name: 'Room',
  price: 100,
  sleeps: 2,
  bedroomAmount: 1,
  bathrooms: 1,
  size: null,
  pictures: [],
  ...overrides,
});

// Room 1 & 2: available for the dates (a party too large for either room
// alone shouldn't block selecting both). Room 3: excluded from the
// availableRooms mock below, so it should render as unavailable.
const rooms: RoomsSectionRoom[] = [
  room({ id: 1, name: 'Room A', sleeps: 2, price: 120 }),
  room({ id: 2, name: 'Room B', sleeps: 2, price: 80 }),
  room({ id: 3, name: 'Booked Room', sleeps: 4, price: 150 }),
];

const mocks = [
  {
    request: {
      query: AVAILABLE_ROOMS,
      variables: { stayId: STAY_ID, checkIn: CHECK_IN, checkOut: CHECK_OUT },
    },
    result: {
      data: {
        availableRooms: [
          { __typename: 'Room', id: 1 },
          { __typename: 'Room', id: 2 },
        ],
      },
    },
  },
];

function renderRoomsSection(
  props: Partial<ComponentProps<typeof RoomsSection>> = {},
) {
  const onToggle = vi.fn();
  render(
    <MockedProvider mocks={mocks}>
      <RoomsSection
        stayId={STAY_ID}
        rooms={rooms}
        checkIn={CHECK_IN}
        checkOut={CHECK_OUT}
        selectedRoomIds={[]}
        onToggle={onToggle}
        {...props}
      />
    </MockedProvider>,
  );
  return { onToggle };
}

describe('RoomsSection', () => {
  it('prompts for dates instead of listing rooms when the range is invalid', () => {
    render(
      <MockedProvider mocks={mocks}>
        <RoomsSection
          stayId={STAY_ID}
          rooms={rooms}
          checkIn=""
          checkOut=""
          selectedRoomIds={[]}
          onToggle={vi.fn()}
        />
      </MockedProvider>,
    );
    expect(
      screen.getByText(/choose your dates to see room availability/i),
    ).toBeInTheDocument();
  });

  it('shows available rooms with a Select button, unblocked by total party size', async () => {
    renderRoomsSection();
    await screen.findByText('Unavailable for these dates');
    expect(screen.getByText('Room A')).toBeInTheDocument();
    expect(screen.getByText('Room B')).toBeInTheDocument();
    expect(screen.getByText(/\$120/)).toBeInTheDocument();
    // Both in-capacity rooms should have a Select button, regardless of
    // whether either alone could sleep the whole party.
    expect(screen.getAllByRole('button', { name: /select$/i })).toHaveLength(2);
  });

  it('badges a room absent from availableRooms as unavailable for the dates, with no Select button', async () => {
    renderRoomsSection();
    expect(
      await screen.findByText('Unavailable for these dates'),
    ).toBeInTheDocument();
    // Only Room A and Room B (present in availableRooms) get a Select
    // button — Booked Room, absent from the mock, gets none.
    expect(screen.getAllByRole('button', { name: /select$/i })).toHaveLength(2);
  });

  it('calls onToggle with the room when Select is clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderRoomsSection();
    await screen.findByText('Unavailable for these dates');
    const selectButtons = screen.getAllByRole('button', { name: /select$/i });
    await user.click(selectButtons[0]);
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Room A' }),
    );
  });

  it('allows selecting more than one room at the same time', async () => {
    renderRoomsSection({ selectedRoomIds: [1, 2] });
    await screen.findByText('Unavailable for these dates');
    const selectedButtons = screen.getAllByRole('button', {
      name: 'Selected',
    });
    expect(selectedButtons).toHaveLength(2);
    expect(screen.getByText(/2 rooms selected/)).toBeInTheDocument();
  });

  it('renders a selected room button as "Selected" but still clickable to deselect', async () => {
    const { onToggle } = renderRoomsSection({ selectedRoomIds: [1] });
    await screen.findByText('Unavailable for these dates');
    const user = userEvent.setup();
    const selectedButton = screen.getByRole('button', { name: 'Selected' });
    expect(selectedButton).not.toBeDisabled();
    await user.click(selectedButton);
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Room A' }),
    );
  });
});
