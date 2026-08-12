import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  X,
  Home,
  Building2,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import type {
  GetStayDetailsQuery,
  GetReviewsByStayQuery,
  GetReviewsByStayQueryVariables,
  GetReviewSummaryQuery,
  GetReviewSummaryQueryVariables,
} from '@/types/__generated__/graphql';
import { GET_REVIEWS_BY_STAY, GET_REVIEW_SUMMARY } from '@/graphql/reviews';
import { ReviewsSection } from '@/components/Reviews/ReviewsSection';
import { calculateTotalPrice, formatPrice } from '@/utils/format';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { PhotoGallery } from '@/components/PhotoGallery';
import { Skeleton } from '@/components/ui/skeleton';
import { PoliciesSection } from '@/components/PoliciesSection';
import { RoomsSection } from '@/components/RoomsSection';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  toggleRoomSelection,
  setBookingDates,
  setBookingTravelers,
} from '@/store/bookingSlice';

const REVIEWS_PAGE_SIZE = 6;

// Lazy-loaded: pulls in @vis.gl/react-google-maps, which otherwise ships
// unused in the initial bundle for every visitor who never opens a stay's
// detail panel.
const StayMap = lazy(() =>
  import('../StayMap/StayMap').then((m) => ({ default: m.StayMap })),
);
// Bar length is scaled relative to the largest bucket, not the review total,
// so the distribution stays readable even when one rating dominates.
function RatingBarGraph({
  summary,
}: {
  summary: GetReviewSummaryQuery['reviewSummary'];
}) {
  const buckets: [number, number][] = [
    [5, summary.fiveStar],
    [4, summary.fourStar],
    [3, summary.threeStar],
    [2, summary.twoStar],
    [1, summary.oneStar],
  ];
  const maxCount = Math.max(...buckets.map(([, count]) => count), 1);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
      <div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
        <span className="text-3xl font-bold text-foreground leading-none">
          {summary.average?.toFixed(1) ?? '—'}
        </span>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="size-3.5 fill-amber-500" />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="flex-1 w-full flex flex-col gap-1.5">
        {buckets.map(([star, count]) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 text-muted-foreground font-medium tabular-nums">
              {star}
            </span>
            <Star className="size-3 shrink-0 fill-muted-foreground/40 text-muted-foreground/40" />
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-frui-orange"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-5 text-right text-muted-foreground tabular-nums">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type GraphQLStay = NonNullable<GetStayDetailsQuery['stay']>;

interface ItemInfoProps {
  stay: GraphQLStay;
  onClose: () => void;
  className?: string;
}

const getRatingText = (val: number) => {
  if (val >= 4.8) return 'Exceptional';
  if (val >= 4.5) return 'Wonderful';
  if (val >= 4.0) return 'Very Good';
  if (val >= 3.5) return 'Good';
  return 'Fair';
};

export function ItemInfo({ stay, onClose, className = '' }: ItemInfoProps) {
  const [reviewsSize, setReviewsSize] = useState(REVIEWS_PAGE_SIZE);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);
  const booking = useAppSelector((state) => state.booking);
  const { checkIn, checkOut } = booking;

  // Only state.search reflects what was actually searched here; sync it into
  // state.booking so RoomsSection's availability query below doesn't run
  // against stale/default dates.
  useEffect(() => {
    dispatch(
      setBookingDates({
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut,
      }),
    );
    dispatch(setBookingTravelers(searchState.travelers));
  }, [
    dispatch,
    searchState.checkIn,
    searchState.checkOut,
    searchState.travelers,
  ]);

  const { data: summaryData, loading: summaryLoading } = useQuery<
    GetReviewSummaryQuery,
    GetReviewSummaryQueryVariables
  >(GET_REVIEW_SUMMARY, {
    variables: { stayId: stay.id },
  });

  const {
    data: reviewsData,
    loading: reviewsLoading,
    previousData: previousReviewsData,
  } = useQuery<GetReviewsByStayQuery, GetReviewsByStayQueryVariables>(
    GET_REVIEWS_BY_STAY,
    {
      variables: {
        stayId: stay.id,
        page: 0,
        size: reviewsSize,
      },
    },
  );

  // Format pricing. Sums the per-night price of every room selected in
  // RoomsSection below (kept in sync with BookingWidgetDesktop/Mobile's
  // pricing); falls back to the stay's cheapest room until one is chosen.
  const selectedRoomsNightly = booking.selectedRooms.reduce(
    (sum, room) => sum + room.price,
    0,
  );
  const nightlyPrice =
    selectedRoomsNightly ||
    (typeof stay.startingFromPrice === 'number' ? stay.startingFromPrice : 0);
  const formattedPrice = formatPrice(
    calculateTotalPrice(nightlyPrice, checkIn, checkOut),
  );

  const summary = summaryData?.reviewSummary;

  // Falls back to Stay.starRating (a separate, host-set field) only when
  // there are no reviews yet.
  const reviewAverage =
    summary && summary.count > 0 && summary.average !== null
      ? summary.average
      : null;
  const rating =
    reviewAverage ??
    (typeof stay.starRating === 'number' ? stay.starRating : 4.8);
  const ratingText = getRatingText(rating);

  const propertyTypeLabel = stay.propertyType === 'HOME' ? 'Home' : 'Hotel';
  const PropertyTypeIcon = stay.propertyType === 'HOME' ? Home : Building2;

  const amenities = (stay.amenities || [])
    .map((a) => AMENITIES_LOOKUP[a.id])
    .filter(Boolean);

  const loadedReviews =
    reviewsData?.reviewsByStay ?? previousReviewsData?.reviewsByStay ?? [];

  const hasMoreReviews =
    summary !== undefined && loadedReviews.length < summary.count;

  return (
    <div
      className={`relative w-full h-full rounded-2xl border border-border bg-card shadow-xl flex flex-col overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close stay details"
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-frui-white border border-neutral-200 shadow-md hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
      >
        <X className="w-5 h-5 text-frui-blue" />
      </button>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <PhotoGallery images={stay.pictures ?? undefined} maxPhotos={3} />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
              {stay.name}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <PropertyTypeIcon className="size-4 shrink-0 text-primary" />
                <span>{propertyTypeLabel}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>
                  {stay.address?.city || 'Palma'},{' '}
                  {stay.address?.stateProvince ||
                    stay.address?.countryCode ||
                    'Spain'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="size-4 fill-amber-500" />
                <span className="font-semibold text-foreground">
                  {rating.toFixed(1)}
                </span>
                <span>{ratingText}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0 text-right">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {stay.isRefundable ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Refundable
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  Non-refundable
                </span>
              )}
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Dates available
              </span>
            </div>

            <div className="text-lg font-bold text-foreground">
              {formattedPrice}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                total
              </span>
            </div>

            <button
              type="button"
              disabled={booking.selectedRooms.length === 0}
              onClick={() => navigate(`/payment/${stay.publicId}`)}
              className="bg-frui-orange hover:bg-frui-orange/90 active:scale-[0.98] text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm select-none text-sm cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Reserve
            </button>

            <p className="text-[10px] text-muted-foreground">
              {booking.selectedRooms.length === 0
                ? 'Select a room to continue'
                : 'Includes all taxes and fees'}
            </p>
          </div>
        </div>

        {stay.about && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
              About this space
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {stay.about}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
            Location Details
          </h3>
          {stay.address ? (
            <div className="text-sm text-muted-foreground flex flex-col gap-1.5">
              <p className="font-medium text-foreground">
                {stay.address.streetAddress}
              </p>
              {stay.address.extendedAddress && (
                <p>{stay.address.extendedAddress}</p>
              )}
              <p>
                {stay.address.city}, {stay.address.stateProvince}{' '}
                {stay.address.postalCode}
              </p>
              <p>{stay.address.countryCode}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No address details available.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
            Policies
          </h3>
          <PoliciesSection stay={stay} checkIn={checkIn} />
        </div>

        {stay.rooms.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
              Room Types
            </h3>
            <RoomsSection
              stayId={stay.id}
              rooms={stay.rooms}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              selectedRoomIds={booking.selectedRooms.map((r) => r.id)}
              onToggle={(room) =>
                dispatch(
                  toggleRoomSelection({
                    id: room.id,
                    name: room.name,
                    price: room.price,
                  }),
                )
              }
            />
          </div>
        )}

        {amenities.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
              What this place offers
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              {amenities.map((amenity, idx) => {
                const Icon = amenity.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className="size-4.5 text-primary shrink-0" />
                    <span>{amenity.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {stay.location && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
              Location
            </h3>
            <Suspense
              fallback={<Skeleton className="h-[300px] w-full rounded-2xl" />}
            >
              <StayMap
                latitude={stay.location.latitude}
                longitude={stay.location.longitude}
                name={stay.name}
              />
            </Suspense>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
            Reviews & Ratings
          </h3>

          <ReviewsSection stayId={stay.id} />

          {summaryLoading && !summary ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-16 bg-muted/60" />
              <Skeleton className="h-2 w-full bg-muted/60 rounded-full" />
              <Skeleton className="h-2 w-full bg-muted/60 rounded-full" />
              <Skeleton className="h-2 w-full bg-muted/60 rounded-full" />
            </div>
          ) : summary && summary.count > 0 ? (
            <RatingBarGraph summary={summary} />
          ) : (
            <p className="text-sm text-muted-foreground">
              There are currently no reviews available for this stay.
            </p>
          )}

          {summary && summary.count > 0 && (
            <>
              {reviewsLoading && loadedReviews.length === 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: REVIEWS_PAGE_SIZE }).map((_, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col gap-2"
                    >
                      <Skeleton className="h-5 w-16 rounded-md bg-muted/60" />
                      <Skeleton className="h-4 w-full bg-muted/60" />
                      <Skeleton className="h-4 w-2/3 bg-muted/60" />
                      <Skeleton className="h-4 w-24 bg-muted/60 mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {loadedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col gap-2"
                    >
                      <span className="inline-block bg-frui-orange/10 text-frui-orange px-2.5 py-1 rounded-md text-xs font-semibold w-fit">
                        {review.rating.toFixed(1)}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {review.text}
                      </p>
                      <div className="text-sm font-bold text-foreground">
                        {review.user.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {hasMoreReviews && (
                <button
                  type="button"
                  onClick={() =>
                    setReviewsSize((size) => size + REVIEWS_PAGE_SIZE)
                  }
                  disabled={reviewsLoading}
                  className="text-sm font-semibold text-frui-orange hover:underline cursor-pointer bg-transparent border-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {reviewsLoading ? 'Loading…' : 'Show more'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
