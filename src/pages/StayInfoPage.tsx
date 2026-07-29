import { PhotoGallery } from '@/components/PhotoGallery';
import { BookingWidget } from '@/components/BookingWidget';
import { PoliciesSection } from '@/components/PoliciesSection';
import { RoomsSection } from '@/components/RoomsSection';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState, useRef } from 'react';
import { GET_STAY_DETAILS_BY_PUBLIC_ID } from '@/graphql/stays';
import { GET_REVIEWS_BY_STAY, GET_REVIEW_SUMMARY } from '@/graphql/reviews';
import { ReviewsSection } from '@/components/Reviews/ReviewsSection';
import type {
  GetStayDetailsByPublicIdQuery,
  GetStayDetailsByPublicIdQueryVariables,
  GetReviewsByStayQuery,
  GetReviewsByStayQueryVariables,
  GetReviewSummaryQuery,
  GetReviewSummaryQueryVariables,
} from '@/types/__generated__/graphql';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { Seo } from '@/lib/seo';
import { SITE_URL } from '@/config/seo';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleRoomSelection } from '@/store/bookingSlice';

export default function StayInfoPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const dispatch = useAppDispatch();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const booking = useAppSelector((state) => state.booking);
  const bookingCheckIn = booking.checkIn;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const cardWidth = 320 + 16; // card width (320px) + gap (16px)
      const scrollTo =
        direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };

  const {
    data,
    loading: stayLoading,
    error: stayError,
  } = useQuery<
    GetStayDetailsByPublicIdQuery,
    GetStayDetailsByPublicIdQueryVariables
  >(GET_STAY_DETAILS_BY_PUBLIC_ID, {
    variables: { publicId: publicId ?? '' },
    skip: !publicId,
  });

  const stayId = data?.stay?.id;

  const {
    data: reviewsData,
    loading: reviewsLoading,
    error: reviewsError,
  } = useQuery<GetReviewsByStayQuery, GetReviewsByStayQueryVariables>(
    GET_REVIEWS_BY_STAY,
    {
      variables: { stayId: stayId ?? 0, page: 0, size: 10 },
      skip: stayId === undefined,
    },
  );

  const stayReviews = reviewsData?.reviewsByStay || [];

  const { data: reviewSummaryData } = useQuery<
    GetReviewSummaryQuery,
    GetReviewSummaryQueryVariables
  >(GET_REVIEW_SUMMARY, {
    variables: { stayId: stayId ?? 0 },
    skip: stayId === undefined,
  });

  const reviewCount = reviewSummaryData?.reviewSummary?.count ?? 0;

  useEffect(() => {
    if (data?.stay) {
      console.log('Stay Details Data:', data.stay);
    }
  }, [data]);

  if (stayError) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Seo
          title="Something Went Wrong"
          path={`/stay/${publicId ?? ''}`}
          noIndex
        />
        <h1 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          {stayError.message}
        </p>
      </div>
    );
  }

  if (!stayLoading && !data?.stay) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Seo title="Stay Not Found" path={`/stay/${publicId ?? ''}`} noIndex />
        <h1 className="text-lg font-semibold text-foreground">
          Stay not found
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          We couldn&apos;t find the stay you&apos;re looking for.
        </p>
      </div>
    );
  }

  const stay = data?.stay;

  // Structured data for rich results: LodgingBusiness with address, price,
  // and an aggregate rating rolled up from the review list (when present).
  const lodgingJsonLd = stay
    ? {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: stay.name,
        description: stay.about ?? undefined,
        url: `${SITE_URL}/stay/${stay.publicId}`,
        image: stay.pictures.map((p) => p.url),
        address: {
          '@type': 'PostalAddress',
          streetAddress: stay.address.streetAddress,
          addressLocality: stay.address.city,
          addressRegion: stay.address.stateProvince ?? undefined,
          postalCode: stay.address.postalCode ?? undefined,
          addressCountry: stay.address.countryCode,
        },
        ...(stay.startingFromPrice != null && {
          priceRange: `$${stay.startingFromPrice.toFixed(2)}`,
        }),
        ...(stayReviews.length > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (
              stayReviews.reduce((sum, r) => sum + r.rating, 0) /
              stayReviews.length
            ).toFixed(1),
            reviewCount: stayReviews.length,
          },
        }),
      }
    : undefined;

  return (
    <div className="flex-1 w-full bg-frui-cream md:py-10 px-4 sm:px-6 lg:px-8">
      {stay && (
        <Seo
          title={stay.name}
          description={
            stay.about
              ? stay.about.slice(0, 155)
              : `${stay.name} in ${stay.address.city} — book on Frui.`
          }
          path={`/stay/${stay.publicId}`}
          image={
            stay.pictures.find((p) => p.isPrimary)?.url ?? stay.pictures[0]?.url
          }
          type="product"
          jsonLd={lodgingJsonLd}
        />
      )}

      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        <PhotoGallery
          images={data?.stay?.pictures ?? undefined}
          maxPhotos={5}
        />

        <div>
          {data?.stay?.name ? (
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
              {data.stay.name}
            </h1>
          ) : (
            <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          )}
        </div>

        {/* `items-start` prevents columns from stretching, enabling the stickiness */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 flex flex-col gap-6">
            <section className="border-b pb-6">
              {data?.stay?.about && (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mt-4">
                  {data.stay.about}
                </div>
              )}
            </section>
            <section className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4 text-frui-blue">
                Amenities
              </h2>
              {data?.stay?.amenities && data.stay.amenities.length > 0 ? (
                <div>
                  <div className="flex flex-col gap-4 text-sm text-gray-700">
                    {data.stay.amenities
                      .slice(0, showAllAmenities ? undefined : 6)
                      .map((amenity) => {
                        const id = Number(amenity.id);
                        const config = AMENITIES_LOOKUP[id];
                        const IconComponent = config?.icon || HelpCircle;
                        const name = config?.name || amenity.name;
                        return (
                          <div
                            key={amenity.id}
                            className="flex items-center gap-3 py-1"
                          >
                            <IconComponent className="w-5 h-5 text-frui-blue shrink-0" />
                            <span className="text-gray-700 font-medium">
                              {name}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  {data.stay.amenities.length > 6 && (
                    <button
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                      className="mt-4 text-sm font-semibold text-frui-orange hover:underline cursor-pointer"
                    >
                      {showAllAmenities ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No amenities listed.</p>
              )}
            </section>
            {stay && stay.rooms.length > 0 && (
              <section className="border-b pb-6">
                <h2 className="text-lg font-semibold mb-4 text-frui-blue">
                  Room Types
                </h2>
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
              </section>
            )}
            <section className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4 text-frui-blue">
                Location Details
              </h2>
              {data?.stay?.address ? (
                <div className="text-sm text-gray-700 flex flex-col gap-1.5">
                  <p className="font-medium">
                    {data.stay.address.streetAddress}
                  </p>
                  {data.stay.address.extendedAddress && (
                    <p>{data.stay.address.extendedAddress}</p>
                  )}
                  <p>
                    {data.stay.address.city}, {data.stay.address.stateProvince}{' '}
                    {data.stay.address.postalCode}
                  </p>
                  <p className="text-gray-500">
                    {data.stay.address.countryCode}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No address details available.
                </p>
              )}
            </section>
            {stay && (
              <section className="border-b pb-6">
                <h2 className="text-lg font-semibold mb-4 text-frui-blue">
                  Policies
                </h2>
                <PoliciesSection stay={stay} checkIn={bookingCheckIn} />
              </section>
            )}
          </div>
          <div className="sticky top-24 md:col-span-1 w-full">
            <BookingWidget stay={data?.stay} />
          </div>
        </div>
        <section className="border-t pt-8 mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-frui-blue">
              Reviews & Comments
              {reviewCount > 0 && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  ({reviewCount})
                </span>
              )}
            </h2>
            {stayReviews.length > 1 && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="p-2 rounded-full border border-neutral-200 bg-frui-white text-frui-blue hover:bg-neutral-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="p-2 rounded-full border border-neutral-200 bg-frui-white text-frui-blue hover:bg-neutral-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {stay && (
            <div className="mb-6">
              <ReviewsSection stayId={stay.id} />
            </div>
          )}

          {reviewsLoading && (
            <p className="text-sm text-gray-500">Loading reviews...</p>
          )}
          {reviewsError && (
            <p className="text-sm text-red-500">
              Error loading reviews: {reviewsError.message}
            </p>
          )}
          {!reviewsLoading && !reviewsError && stayReviews.length === 0 && (
            <p className="text-sm text-gray-500 font-medium">
              No reviews have been done yet
            </p>
          )}
          {!reviewsLoading && !reviewsError && stayReviews.length > 0 && (
            <div
              ref={scrollContainerRef}
              className={`flex flex-row gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none ${
                stayReviews.length === 1 ? 'justify-center' : 'justify-start'
              }`}
            >
              {stayReviews.map((review) => {
                const name = review.user.name;
                const ratingVal = review.rating.toFixed(1);
                const ratingText =
                  ratingVal === '5.0'
                    ? 'Exceptional'
                    : ratingVal >= '4.0'
                      ? 'Excellent'
                      : ratingVal >= '3.0'
                        ? 'Good'
                        : 'Fair';
                return (
                  <div
                    key={review.id}
                    className="w-[85%] sm:w-[320px] shrink-0 min-h-[220px] p-5 rounded-2xl bg-frui-white border border-neutral-100 shadow-xs flex flex-col justify-between snap-start"
                  >
                    <div>
                      {/* Rating Tag */}
                      <span className="inline-block bg-frui-orange/10 text-frui-orange px-2.5 py-1 rounded-md text-xs font-semibold w-fit">
                        {ratingVal} {ratingText}
                      </span>
                      {/* Review Text */}
                      <p className="text-sm text-gray-700 leading-relaxed mt-4 line-clamp-4">
                        {review.text}
                      </p>
                    </div>
                    {/* User Footer */}
                    <div className="mt-4 border-t border-neutral-100 pt-3">
                      <div className="text-sm font-bold text-frui-blue">
                        {name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
