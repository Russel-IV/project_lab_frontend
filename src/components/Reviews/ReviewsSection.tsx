import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';

import { useAppSelector } from '@/store/hooks';
import { MY_REVIEW_FOR_STAY, CREATE_REVIEW } from '@/graphql/reviews';
import { MY_BOOKING_STATUS_FOR_STAY } from '@/graphql/bookings';
import type {
  MyReviewForStayQuery,
  MyReviewForStayQueryVariables,
  CreateReviewMutation,
  CreateReviewMutationVariables,
  MyBookingStatusForStayQuery,
  MyBookingStatusForStayQueryVariables,
} from '@/types/__generated__/graphql';
import { Button } from '@/components/ui/button';
import { ReviewForm } from './ReviewForm';
import { MyReviewCard } from './MyReviewCard';

export interface ReviewsSectionProps {
  stayId: number;
}

/**
 * Owns the "leave a review" flow (C1-C8 of the review-submission story) —
 * eligibility check, form, and the user's own existing review. Mounted
 * alongside each page's own (differently laid out) review list/summary,
 * which keeps refreshing itself via Apollo's refetchQueries below rather
 * than through a prop callback, so this stays decoupled from how each
 * caller renders its list.
 */
export function ReviewsSection({ stayId }: ReviewsSectionProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [formOpen, setFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: bookingStatusData } = useQuery<
    MyBookingStatusForStayQuery,
    MyBookingStatusForStayQueryVariables
  >(MY_BOOKING_STATUS_FOR_STAY, {
    variables: { stayId },
    skip: !user,
  });

  const { data: myReviewData, refetch: refetchMyReview } = useQuery<
    MyReviewForStayQuery,
    MyReviewForStayQueryVariables
  >(MY_REVIEW_FOR_STAY, {
    variables: { stayId },
    skip: !user,
  });

  const [createReview, { loading: submitting }] = useMutation<
    CreateReviewMutation,
    CreateReviewMutationVariables
  >(CREATE_REVIEW, {
    refetchQueries: ['GetReviewsByStay', 'GetReviewSummary'],
  });

  if (!user) return null;

  const myReview = myReviewData?.myReviewForStay;
  const hasCompletedBooking =
    bookingStatusData?.myBookingStatusForStay.hasCompletedBooking ?? false;

  if (myReview) {
    return (
      <MyReviewCard
        rating={myReview.rating}
        text={myReview.text}
        userName={myReview.user.name}
      />
    );
  }

  if (!hasCompletedBooking) return null;

  if (!formOpen) {
    return (
      <Button variant="secondary" onClick={() => setFormOpen(true)}>
        Leave a Review
      </Button>
    );
  }

  const handleSubmit = async (rating: number, text: string) => {
    setSubmitError(null);
    try {
      await createReview({ variables: { input: { stayId, rating, text } } });
      await refetchMyReview();
      setFormOpen(false);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    }
  };

  return (
    <ReviewForm
      onSubmit={handleSubmit}
      onCancel={() => setFormOpen(false)}
      submitting={submitting}
      submitError={submitError}
    />
  );
}
