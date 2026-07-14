import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import authReducer, { type AuthState } from '@/store/authSlice';
import type { AuthUser } from '@/api/auth';
import { MY_REVIEW_FOR_STAY, CREATE_REVIEW } from '@/graphql/reviews';
import { MY_BOOKING_STATUS_FOR_STAY } from '@/graphql/bookings';
import { ReviewsSection } from './ReviewsSection';

const STAY_ID = 42;
const USER: AuthUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  profilePictureUrl: null,
};

function renderWithProviders(
  mocks: MockedResponse[],
  authState: AuthState = { user: USER, token: 'jwt' },
) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });
  return render(
    <Provider store={store}>
      <MockedProvider mocks={mocks}>
        <ReviewsSection stayId={STAY_ID} />
      </MockedProvider>
    </Provider>,
  );
}

function bookingStatusMock(hasCompletedBooking: boolean): MockedResponse {
  return {
    request: {
      query: MY_BOOKING_STATUS_FOR_STAY,
      variables: { stayId: STAY_ID },
    },
    result: {
      data: {
        myBookingStatusForStay: {
          __typename: 'BookingStatusForStay',
          hasCompletedBooking,
        },
      },
    },
  };
}

function myReviewMock(
  review: {
    id: number;
    text: string;
    rating: number;
    user: { id: number; name: string };
  } | null,
): MockedResponse {
  return {
    request: {
      query: MY_REVIEW_FOR_STAY,
      variables: { stayId: STAY_ID },
    },
    result: {
      data: {
        myReviewForStay: review
          ? {
              __typename: 'Review',
              id: review.id,
              text: review.text,
              rating: review.rating,
              stayId: STAY_ID,
              user: { __typename: 'User', ...review.user },
            }
          : null,
      },
    },
  };
}

describe('ReviewsSection', () => {
  it('renders nothing when the user is not logged in', () => {
    renderWithProviders([], { user: null, token: null });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders nothing when the user has no completed booking and no review yet', async () => {
    renderWithProviders([bookingStatusMock(false), myReviewMock(null)]);
    await waitFor(() => {
      expect(screen.queryByText('Leave a Review')).not.toBeInTheDocument();
    });
  });

  it('shows the Leave a Review button when eligible, then reveals the form on click', async () => {
    const user = userEvent.setup();
    renderWithProviders([bookingStatusMock(true), myReviewMock(null)]);

    const button = await screen.findByRole('button', {
      name: 'Leave a Review',
    });
    await user.click(button);

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
  });

  it('shows the existing review read-only instead of the button/form', async () => {
    renderWithProviders([
      bookingStatusMock(true),
      myReviewMock({
        id: 7,
        text: 'Amazing place!',
        rating: 5,
        user: { id: 1, name: 'Alice' },
      }),
    ]);

    expect(await screen.findByText('Amazing place!')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Leave a Review' }),
    ).not.toBeInTheDocument();
  });

  it('submits a new review and then shows it read-only', async () => {
    const user = userEvent.setup();
    const submittedReviewMock = myReviewMock({
      id: 9,
      text: 'Great stay!',
      rating: 4,
      user: { id: 1, name: 'Alice' },
    });

    const mocks: MockedResponse[] = [
      bookingStatusMock(true),
      myReviewMock(null),
      {
        request: {
          query: CREATE_REVIEW,
          variables: {
            input: { stayId: STAY_ID, rating: 4, text: 'Great stay!' },
          },
        },
        result: {
          data: {
            createReview: {
              __typename: 'Review',
              id: 9,
              text: 'Great stay!',
              rating: 4,
              stayId: STAY_ID,
              user: { __typename: 'User', id: 1, name: 'Alice' },
            },
          },
        },
      },
      submittedReviewMock,
    ];

    renderWithProviders(mocks);

    const button = await screen.findByRole('button', {
      name: 'Leave a Review',
    });
    await user.click(button);
    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    await user.type(screen.getByLabelText('Your review'), 'Great stay!');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Great stay!')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Leave a Review' }),
    ).not.toBeInTheDocument();
  });
});
