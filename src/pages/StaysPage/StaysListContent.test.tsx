import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import searchReducer from '@/store/searchSlice';
import filtersReducer, { type FiltersState } from '@/store/filtersSlice';
import { GET_STAYS } from '@/graphql/stays';
import { StaysListContent } from './StaysListContent';

const PAGE_SIZE = 12;

function mockStay(id: number, name: string) {
  return {
    __typename: 'Stay' as const,
    id,
    name,
    about: null,
    propertyType: 'HOME' as const,
    isRefundable: true,
    starRating: 4,
    daysFromBookingCancellationDeadline: null,
    policiesText: null,
    importantInformation: null,
    startingFromPrice: 100,
    address: {
      __typename: 'Address' as const,
      id,
      streetAddress: '1 Main St',
      extendedAddress: null,
      city: 'Miami',
      stateProvince: 'FL',
      postalCode: '33101',
      countryCode: 'US',
    },
    rooms: [],
    pictures: [],
    host: { __typename: 'Host' as const, id: 1 },
    propertyBrand: null,
    amenities: [],
    views: [],
    accessibilities: [],
    mealPlans: [],
    paymentTypes: [],
    travelerExperiences: [],
    location: null,
  };
}

function staysPageMock(
  page: number,
  stays: ReturnType<typeof mockStay>[],
  hasNextPage: boolean,
  totalCount: number,
): MockedResponse {
  return {
    request: {
      query: GET_STAYS,
      variables: { filter: undefined, page, size: PAGE_SIZE },
    },
    result: {
      data: {
        stays: {
          __typename: 'StayConnection',
          totalCount,
          hasNextPage,
          items: stays,
        },
      },
    },
  };
}

function renderWithProviders(
  mocks: MockedResponse[],
  filtersState?: Partial<FiltersState>,
) {
  const store = configureStore({
    reducer: { search: searchReducer, filters: filtersReducer },
    preloadedState: {
      search: {
        place: '',
        placeRegionId: null,
        checkIn: '2026-08-01',
        checkOut: '2026-08-05',
        travelers: '2',
      },
      filters: {
        priceMin: null,
        priceMax: null,
        propertyType: null,
        freeCancellation: false,
        starRatings: [],
        bedrooms: [],
        propertyAmenityIds: [],
        roomAmenityIds: [],
        ...filtersState,
      },
    },
  });

  return render(
    <MemoryRouter>
      <Provider store={store}>
        <MockedProvider mocks={mocks}>
          <StaysListContent
            filter={undefined}
            favorites={{}}
            toggleFavorite={vi.fn()}
            selectedStayId={null}
            setSelectedStayId={vi.fn()}
          />
        </MockedProvider>
      </Provider>
    </MemoryRouter>,
  );
}

describe('StaysListContent', () => {
  beforeEach(() => {
    // jsdom has no real layout; give every virtualized row a fixed,
    // non-zero measured height so @tanstack/react-virtual's row math
    // (which row range is "visible") is deterministic across test runs.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      height: 320,
      width: 320,
      top: 0,
      left: 0,
      right: 320,
      bottom: 320,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the no-search-results message when the backend returns no stays and no filters are active', async () => {
    renderWithProviders([staysPageMock(0, [], false, 0)]);

    expect(
      await screen.findByText(
        'There are no stays that fit your needs available currently. Try searching again with different requirements.',
      ),
    ).toBeInTheDocument();
  });

  it('shows the filters-specific empty message when a FilterBar filter is active', async () => {
    renderWithProviders([staysPageMock(0, [], false, 0)], {
      freeCancellation: true,
    });

    expect(
      await screen.findByText(
        'No stays match your filters. Try removing some filters to see more results.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the first page of stays returned by the backend', async () => {
    const firstPage = Array.from({ length: PAGE_SIZE }, (_, i) =>
      mockStay(i + 1, `Stay ${i + 1}`),
    );
    renderWithProviders([staysPageMock(0, firstPage, false, PAGE_SIZE)]);

    expect(await screen.findByText('Stay 1')).toBeInTheDocument();
    expect(screen.getByText(`Stay ${PAGE_SIZE}`)).toBeInTheDocument();
  });

  it('automatically fetches the next page once the loaded rows fit within the viewport (infinite scroll, no pagination controls)', async () => {
    const firstPage = Array.from({ length: PAGE_SIZE }, (_, i) =>
      mockStay(i + 1, `Stay ${i + 1}`),
    );
    const secondPage = [mockStay(13, 'Stay 13')];

    renderWithProviders([
      staysPageMock(0, firstPage, true, PAGE_SIZE + 1),
      staysPageMock(1, secondPage, false, PAGE_SIZE + 1),
    ]);

    expect(await screen.findByText('Stay 1')).toBeInTheDocument();
    // Confirms fetchMore fired on its own (no button/click), merging page 2
    // onto page 1 via the Apollo field policy.
    expect(await screen.findByText('Stay 13')).toBeInTheDocument();

    expect(
      screen.queryByRole('navigation', { name: 'Pagination Navigation' }),
    ).not.toBeInTheDocument();
  });
});
