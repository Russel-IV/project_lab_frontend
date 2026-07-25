import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { MY_REVIEWS } from '@/graphql/reviews';
import type {
  MyReviewsQuery,
  MyReviewsQueryVariables,
} from '@/types/__generated__/graphql';

const PAGE_SIZE = 10;

export function ReviewHistoryTab() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useQuery<
    MyReviewsQuery,
    MyReviewsQueryVariables
  >(MY_REVIEWS, { variables: { page: 0, size: 100 } });

  const reviews = data?.myReviews ?? [];
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const showPagination = reviews.length > PAGE_SIZE;

  const paginatedReviews = showPagination
    ? reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : reviews;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Review History</CardTitle>
        <CardDescription>Reviews you&apos;ve left for stays.</CardDescription>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">Loading your reviews…</p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Unable to load your reviews right now.
          </p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You have no previous reviews, use your{' '}
            <Link
              to="/profile/bookings"
              className="font-medium text-frui-orange hover:underline"
            >
              booking history
            </Link>{' '}
            to see what stays you&apos;ve booked in the past and leave a review.
          </p>
        )}

        {!loading && !error && reviews.length > 0 && (
          <>
            <div className="flex flex-col">
              {paginatedReviews.map((review, i) => {
                const location = [
                  review.stay.address.city,
                  review.stay.address.stateProvince,
                ]
                  .filter(Boolean)
                  .join(', ');

                return (
                  <Fragment key={review.id}>
                    {i > 0 && <div className="border-t border-border" />}
                    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {review.stay.name}
                          </p>
                          <StarRating
                            value={review.rating}
                            readOnly
                            size="sm"
                          />
                        </div>
                        {location && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" />
                            {location}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.text}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          render={<Link to={`/stay/${review.stay.publicId}`} />}
                          nativeButton={false}
                        >
                          Go to review page
                        </Button>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>

            {showPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ReviewHistoryTab;
