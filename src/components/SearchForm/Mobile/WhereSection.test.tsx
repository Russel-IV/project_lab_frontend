import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import {
  GET_DESTINATIONS,
  GET_POPULAR_DESTINATIONS,
} from '@/graphql/destinations';
import { SearchFormMobileContext } from './SearchFormMobileContext';
import { WhereSection } from './WhereSection';

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

const noMatchMock = {
  request: {
    query: GET_DESTINATIONS,
    variables: { search: 'nowhereland', limit: 20 },
  },
  result: { data: { destinations: [] } },
};

const mocks = [popularMock, searchMock, noMatchMock];

function renderWhereSection(
  overrides: Partial<
    React.ComponentProps<typeof SearchFormMobileContext.Provider>['value']
  > = {},
) {
  const handleSelectPlace = vi.fn();
  const handleSelectSurpriseMe = vi.fn();
  const setLocalPlace = vi.fn();
  const setActiveSection = vi.fn();
  render(
    <MockedProvider mocks={mocks}>
      <SearchFormMobileContext.Provider
        value={{
          localPlace: '',
          localPlaceRegionId: null,
          localIsSurpriseMe: false,
          setLocalPlace,
          localCheckIn: '',
          localCheckOut: '',
          localTravelers: '1 travelers, 1 rooms',
          activeSection: 'where',
          setActiveSection,
          rooms: [],
          handleSelectPlace,
          handleSelectSurpriseMe,
          handleSelectDates: vi.fn(),
          updateAdults: vi.fn(),
          addRoom: vi.fn(),
          removeRoom: vi.fn(),
          displayDatesValue: 'Select Dates',
          onClose: vi.fn(),
          ...overrides,
        }}
      >
        <WhereSection />
      </SearchFormMobileContext.Provider>
    </MockedProvider>,
  );
  return {
    handleSelectPlace,
    handleSelectSurpriseMe,
    setLocalPlace,
    setActiveSection,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('WhereSection', () => {
  it('shows recent searches before anything is typed, without cross-filtering against known destinations', async () => {
    localStorage.setItem(
      'recent_searches',
      JSON.stringify([{ label: 'Nowhereland' }]),
    );
    const user = userEvent.setup();
    renderWhereSection();
    await user.click(screen.getByPlaceholderText('Where do you want to go?'));
    expect(await screen.findByText('Recent searches')).toBeInTheDocument();
    expect(screen.getByText('Nowhereland')).toBeInTheDocument();
  });

  it('falls back to popular destinations when there are no recent searches', async () => {
    const user = userEvent.setup();
    renderWhereSection();
    await user.click(screen.getByPlaceholderText('Where do you want to go?'));
    expect(await screen.findByText('Paris, France')).toBeInTheDocument();
  });

  it('reads old string-array recent_searches for backward compatibility', async () => {
    localStorage.setItem('recent_searches', JSON.stringify(['Old Format']));
    const user = userEvent.setup();
    renderWhereSection();
    await user.click(screen.getByPlaceholderText('Where do you want to go?'));
    expect(await screen.findByText('Old Format')).toBeInTheDocument();
  });

  it('searches server-side once typing starts and shows ranked/formatted results', async () => {
    const user = userEvent.setup();
    renderWhereSection();
    const input = screen.getByPlaceholderText('Where do you want to go?');
    await user.type(input, 'zer');
    expect(await screen.findByText('Zermatt, Switzerland')).toBeInTheDocument();
  });

  it('commits label + regionId via handleSelectPlace when a searched destination is picked', async () => {
    const user = userEvent.setup();
    const { handleSelectPlace } = renderWhereSection();
    const input = screen.getByPlaceholderText('Where do you want to go?');
    await user.type(input, 'zer');
    await user.click(await screen.findByText('Zermatt, Switzerland'));
    expect(handleSelectPlace).toHaveBeenCalledWith('Zermatt, Switzerland', 3);
  });

  it('still commits typed free text via setLocalPlace when no suggestion is picked', async () => {
    const user = userEvent.setup();
    const { setLocalPlace } = renderWhereSection();
    const input = screen.getByPlaceholderText('Where do you want to go?');
    await user.type(input, 'nowhereland');
    expect(setLocalPlace).toHaveBeenCalledWith('nowhereland');
  });

  it('renders the collapsed summary row when not the active section', () => {
    renderWhereSection({ activeSection: 'dates', localPlace: 'Paris' });
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Where do you want to go?'),
    ).not.toBeInTheDocument();
  });
});
