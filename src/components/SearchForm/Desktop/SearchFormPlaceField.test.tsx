import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import {
  GET_DESTINATIONS,
  GET_POPULAR_DESTINATIONS,
} from '@/graphql/destinations';
import { SearchFormContext } from './SearchFormContext';
import { SearchFormPlaceField } from './SearchFormPlaceField';

const popularMock = {
  request: { query: GET_POPULAR_DESTINATIONS, variables: { limit: 8 } },
  result: {
    data: {
      popularDestinations: [
        {
          __typename: 'Destination',
          city: 'Paris',
          countryCode: 'FR',
          regionId: 1,
        },
        {
          __typename: 'Destination',
          city: 'Tokyo',
          countryCode: 'JP',
          regionId: 2,
        },
      ],
    },
  },
};

const searchMock = {
  request: {
    query: GET_DESTINATIONS,
    variables: { search: 'zer', limit: 20 },
  },
  result: {
    data: {
      destinations: [
        {
          __typename: 'Destination',
          city: 'Zermatt',
          countryCode: 'CH',
          regionId: 3,
        },
      ],
    },
  },
};

const emptySearchMock = {
  request: { query: GET_DESTINATIONS, variables: { search: null, limit: 20 } },
  result: { data: { destinations: [] } },
};

const noMatchMock = {
  request: {
    query: GET_DESTINATIONS,
    variables: { search: 'nowhereland', limit: 20 },
  },
  result: { data: { destinations: [] } },
};

function renderField(
  overrides: Partial<{
    placeValue: string;
    placeRegionId: number | null;
    onPlaceChange: (val: string) => void;
    onPlaceSelect: (regionId: number, label: string) => void;
  }> = {},
) {
  const onPlaceChange = overrides.onPlaceChange ?? vi.fn();
  const onPlaceSelect = overrides.onPlaceSelect ?? vi.fn();
  render(
    <MockedProvider
      mocks={[popularMock, searchMock, emptySearchMock, noMatchMock]}
    >
      <SearchFormContext.Provider
        value={{
          placeValue: overrides.placeValue ?? '',
          placeRegionId: overrides.placeRegionId ?? null,
          isSurpriseMe: false,
          checkInValue: '',
          checkOutValue: '',
          travelersValue: '',
          onPlaceChange,
          onPlaceSelect,
          onSurpriseMeSelect: vi.fn(),
          onDatesChange: vi.fn(),
          onTravelersChange: vi.fn(),
          onSubmit: vi.fn(),
        }}
      >
        <SearchFormPlaceField />
      </SearchFormContext.Provider>
    </MockedProvider>,
  );
  return { onPlaceChange, onPlaceSelect };
}

describe('SearchFormPlaceField', () => {
  it('shows popular destinations before anything is typed', async () => {
    const user = userEvent.setup();
    renderField();
    await user.click(screen.getByPlaceholderText('Where are we going?'));
    expect(await screen.findByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
  });

  it('commits regionId + label via onPlaceSelect when picking a popular destination', async () => {
    const user = userEvent.setup();
    const { onPlaceSelect } = renderField();
    await user.click(screen.getByPlaceholderText('Where are we going?'));
    await user.click(await screen.findByText('Paris, France'));
    expect(onPlaceSelect).toHaveBeenCalledWith(1, 'Paris, France');
  });

  it('searches server-side once typing starts and shows ranked/formatted results', async () => {
    const user = userEvent.setup();
    renderField();
    await user.type(screen.getByPlaceholderText('Where are we going?'), 'zer');
    expect(await screen.findByText('Zermatt, Switzerland')).toBeInTheDocument();
  });

  it('commits regionId + label for a searched (not just popular) destination', async () => {
    const user = userEvent.setup();
    const { onPlaceSelect } = renderField();
    await user.type(screen.getByPlaceholderText('Where are we going?'), 'zer');
    await user.click(await screen.findByText('Zermatt, Switzerland'));
    expect(onPlaceSelect).toHaveBeenCalledWith(3, 'Zermatt, Switzerland');
  });

  it('still commits typed free text via onPlaceChange when no suggestion is picked', async () => {
    const user = userEvent.setup();
    const { onPlaceChange } = renderField();
    await user.type(
      screen.getByPlaceholderText('Where are we going?'),
      'nowhereland',
    );
    expect(onPlaceChange).toHaveBeenCalledWith('nowhereland');
  });
});
