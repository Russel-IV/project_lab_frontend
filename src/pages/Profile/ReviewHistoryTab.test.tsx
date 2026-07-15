import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MY_REVIEWS } from '@/graphql/reviews';
import { ReviewHistoryTab } from './ReviewHistoryTab';

const EMPTY_STATE_TEXT =
  "You have no previous reviews, use your booking history to see what stays you've booked in the past and leave a review.";

function reviewsMock(
  reviews: Array<{
    id: number;
    text: string;
    rating: number;
    stayId: number;
    stay: {
      id: number;
      name: string;
      city: string;
      stateProvince: string | null;
    };
  }>,
): MockedResponse {
  return {
    request: { query: MY_REVIEWS, variables: { page: 0, size: 100 } },
    result: {
      data: {
        myReviews: reviews.map((r) => ({
          __typename: 'Review' as const,
          id: r.id,
          text: r.text,
          rating: r.rating,
          stayId: r.stayId,
          stay: {
            __typename: 'Stay' as const,
            id: r.stay.id,
            name: r.stay.name,
            address: {
              __typename: 'Address' as const,
              city: r.stay.city,
              stateProvince: r.stay.stateProvince,
            },
          },
        })),
      },
    },
  };
}

function renderWithProviders(mocks: MockedResponse[]) {
  return render(
    <MemoryRouter>
      <MockedProvider mocks={mocks}>
        <ReviewHistoryTab />
      </MockedProvider>
    </MemoryRouter>,
  );
}

describe('ReviewHistoryTab', () => {
  it('shows the empty state with a link to booking history when there are no reviews', async () => {
    renderWithProviders([reviewsMock([])]);

    expect(
      await screen.findByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'p' &&
          element.textContent === EMPTY_STATE_TEXT,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'booking history' }),
    ).toHaveAttribute('href', '/profile/bookings');
  });

  it('lists a review with rating, text, stay name, location, and a link to the stay', async () => {
    renderWithProviders([
      reviewsMock([
        {
          id: 1,
          text: 'Loved the view!',
          rating: 4,
          stayId: 99,
          stay: {
            id: 99,
            name: 'Ocean Villa',
            city: 'Miami',
            stateProvince: 'FL',
          },
        },
      ]),
    ]);

    expect(await screen.findByText('Ocean Villa')).toBeInTheDocument();
    expect(screen.getByText('Loved the view!')).toBeInTheDocument();
    expect(screen.getByText('Miami, FL')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '4 out of 5 stars' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to review page' }),
    ).toHaveAttribute('href', '/stay/99');
  });

  it('paginates 10 reviews at a time once there are more than 10', async () => {
    const user = userEvent.setup();
    const reviews = Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      text: `Review number ${i + 1}`,
      rating: 5,
      stayId: i + 1,
      stay: {
        id: i + 1,
        name: `Stay ${i + 1}`,
        city: 'Some City',
        stateProvince: null,
      },
    }));

    renderWithProviders([reviewsMock(reviews)]);

    expect(await screen.findByText('Stay 1')).toBeInTheDocument();
    expect(screen.queryByText('Stay 11')).not.toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Pagination Navigation' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(await screen.findByText('Stay 11')).toBeInTheDocument();
    expect(screen.queryByText('Stay 1')).not.toBeInTheDocument();
  });

  it('does not show pagination controls with 10 or fewer reviews', async () => {
    const reviews = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      text: `Review number ${i + 1}`,
      rating: 5,
      stayId: i + 1,
      stay: {
        id: i + 1,
        name: `Stay ${i + 1}`,
        city: 'Some City',
        stateProvince: null,
      },
    }));

    renderWithProviders([reviewsMock(reviews)]);

    expect(await screen.findByText('Stay 1')).toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: 'Pagination Navigation' }),
    ).not.toBeInTheDocument();
  });
});
