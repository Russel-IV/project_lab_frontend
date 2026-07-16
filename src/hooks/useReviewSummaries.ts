import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface ReviewSummaryData {
  count: number;
  average: number | null;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

const EMPTY_QUERY = gql`
  query GetReviewSummariesBatchEmpty {
    __typename
  }
`;

// Stay list cards each need a review summary, but firing one
// GetReviewSummary query per card (N+1) means a page of 12 results opens 12
// extra HTTP round-trips on top of the GetStays request. Since the schema
// only exposes reviewSummary(stayId) one at a time, batch it on the client
// by aliasing every id into a single query - one round trip for the whole
// page instead of one per card.
export function useReviewSummaries(stayIds: number[]) {
  const uniqueIds = useMemo(
    () => Array.from(new Set(stayIds)).sort((a, b) => a - b),
    [stayIds],
  );

  const query = useMemo(() => {
    if (uniqueIds.length === 0) return null;
    const fields = uniqueIds
      .map(
        (id) => `r${id}: reviewSummary(stayId: ${id}) {
        count
        average
        oneStar
        twoStar
        threeStar
        fourStar
        fiveStar
      }`,
      )
      .join('\n');
    return gql`query GetReviewSummariesBatch { ${fields} }`;
  }, [uniqueIds]);

  const { data, loading } = useQuery<Record<string, ReviewSummaryData | null>>(
    query ?? EMPTY_QUERY,
    { skip: !query },
  );

  const summaries = useMemo(() => {
    const map = new Map<number, ReviewSummaryData | null>();
    if (data) {
      for (const id of uniqueIds) {
        map.set(id, data[`r${id}`] ?? null);
      }
    }
    return map;
  }, [data, uniqueIds]);

  return { summaries, loading: !!query && loading };
}
