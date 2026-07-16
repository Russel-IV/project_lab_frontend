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
