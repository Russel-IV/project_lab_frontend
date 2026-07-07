import { useQuery } from '@apollo/client/react';
import { GET_STAY_DETAILS } from '@/graphql/stays';
import type {
  GetStayDetailsQuery,
  GetStayDetailsQueryVariables,
} from '@/types/__generated__/graphql';
import {
  ItemInfo,
  ItemInfoSkeleton,
  ItemInfoMessage,
} from '@/components/ItemInfo';

interface StaysDetailContentProps {
  selectedStayId: number | null;
  onClose: () => void;
}

export function StaysDetailContent({
  selectedStayId,
  onClose,
}: StaysDetailContentProps) {
  const { data, loading, error } = useQuery<
    GetStayDetailsQuery,
    GetStayDetailsQueryVariables
  >(GET_STAY_DETAILS, {
    variables: { id: selectedStayId ?? 0 },
    skip: selectedStayId === null,
  });

  if (loading) {
    return <ItemInfoSkeleton />;
  }

  // The backend returns a GraphQL error (in addition to a null `stay`) when
  // the id doesn't exist, so a missing-stay message needs its own branch
  // rather than falling through to the generic error fallback.
  const isNotFound = error?.message.toLowerCase().includes('not found');

  if (error && !isNotFound) {
    return (
      <ItemInfoMessage
        title="Something went wrong"
        message={error.message}
        onClose={onClose}
      />
    );
  }

  if (isNotFound || !data?.stay) {
    return (
      <ItemInfoMessage
        title="Stay not found"
        message="We couldn't find the stay you're looking for. It may have been removed."
        onClose={onClose}
      />
    );
  }

  return <ItemInfo stay={data.stay} onClose={onClose} />;
}
