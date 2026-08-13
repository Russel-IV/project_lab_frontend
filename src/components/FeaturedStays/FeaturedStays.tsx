import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import type {
  GetStaysQuery,
  GetStaysQueryVariables,
} from '@/types/__generated__/graphql';
import { GET_STAYS } from '@/graphql/stays';
import {
  StayCardVariant,
  StayCardSkeleton,
} from '@/components/StayCardVariant';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useReviewSummaries } from '@/hooks/useReviewSummaries';

const FEATURED_STAYS_COUNT = 6;

export default function FeaturedStays() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const { data, loading } = useQuery<GetStaysQuery, GetStaysQueryVariables>(
    GET_STAYS,
    { variables: { page: 0, size: FEATURED_STAYS_COUNT } },
  );

  const stays = data?.stays.items ?? [];
  const { summaries: reviewSummaries, loading: reviewSummariesLoading } =
    useReviewSummaries(stays.map((stay) => stay.id));

  if (!loading && stays.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 text-left">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121324]">
          Trending stays
        </h2>
        <Button
          variant="secondary"
          size="sm"
          render={<Link to="/stays" />}
          nativeButton={false}
        >
          See all stays
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: FEATURED_STAYS_COUNT }).map((_, idx) => (
              <StayCardSkeleton key={idx} />
            ))
          : stays.map((stay, idx) => (
              <StayCardVariant
                key={stay.id}
                stay={stay}
                isLiked={!!favorites[stay.id]}
                onToggleFavorite={toggleFavorite}
                onClick={() => navigate(`/stay/${stay.publicId}`)}
                reviewSummary={reviewSummaries.get(stay.id)}
                reviewSummaryLoading={reviewSummariesLoading}
                priority={idx < 3}
              />
            ))}
      </div>
    </section>
  );
}
