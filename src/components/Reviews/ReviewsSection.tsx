import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';

import { useAppSelector } from '@/store/hooks';
import {
  MY_REVIEW_FOR_STAY,
  CREATE_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
} from '@/graphql/reviews';
import { MY_BOOKING_STATUS_FOR_STAY } from '@/graphql/bookings';
import type {
  MyReviewForStayQuery,
  MyReviewForStayQueryVariables,
  CreateReviewMutation,
  CreateReviewMutationVariables,
  UpdateReviewMutation,
  UpdateReviewMutationVariables,
  DeleteReviewMutation,
  DeleteReviewMutationVariables,
  MyBookingStatusForStayQuery,
  MyBookingStatusForStayQueryVariables,
} from '@/types/__generated__/graphql';
import { Button } from '@/components/ui/button';
import { ReviewForm } from './ReviewForm';
import { MyReviewCard } from './MyReviewCard';

export interface ReviewsSectionProps {
  stayId: number;
}

export function ReviewsSection({ stayId }: ReviewsSectionProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const [updateReview, { loading: updating }] = useMutation<
    UpdateReviewMutation,
    UpdateReviewMutationVariables
  >(UPDATE_REVIEW, {
    refetchQueries: ['GetReviewsByStay', 'GetReviewSummary'],
  });

  const [deleteReview, { loading: deleting }] = useMutation<
    DeleteReviewMutation,
    DeleteReviewMutationVariables
  >(DELETE_REVIEW, {
    refetchQueries: ['GetReviewsByStay', 'GetReviewSummary'],
  });

  if (!user) return null;

  const myReview = myReviewData?.myReviewForStay;
  const hasCompletedBooking =
    bookingStatusData?.myBookingStatusForStay.hasCompletedBooking ?? false;

  const handleDelete = async () => {
    if (!myReview) return;
    setDeleteError(null);
    try {
      await deleteReview({ variables: { id: myReview.id } });
      await refetchMyReview();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    }
  };

  if (myReview && !editing) {
    return (
      <>
        <MyReviewCard
          rating={myReview.rating}
          text={myReview.text}
          userName={myReview.user.name}
          onEdit={() => {
            setEditError(null);
            setEditing(true);
          }}
          onDelete={handleDelete}
          deleting={deleting}
        />
        {deleteError && (
          <p className="text-sm text-destructive">{deleteError}</p>
        )}
      </>
    );
  }

  if (myReview && editing) {
    const handleUpdate = async (rating: number, text: string) => {
      setEditError(null);
      try {
        await updateReview({
          variables: { id: myReview.id, input: { stayId, rating, text } },
        });
        await refetchMyReview();
        setEditing(false);
      } catch (err) {
        setEditError(
          err instanceof Error ? err.message : 'Something went wrong.',
        );
      }
    };

    return (
      <ReviewForm
        onSubmit={handleUpdate}
        onCancel={() => setEditing(false)}
        submitting={updating}
        submitError={editError}
        initialRating={myReview.rating}
        initialText={myReview.text}
        submitLabel="Save"
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
