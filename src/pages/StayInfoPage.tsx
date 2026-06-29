import StayPhotoGallery from '@/StayPhotoGallery/StayPhotoGallery';
import { BookingWidgetMobile } from '@/components/BookingWidget/BookingWidgetMobile';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState, useRef } from 'react';
import { GET_STAY_DETAILS } from '@/graphql/stays';
import { GET_REVIEWS } from '@/graphql/reviews';
import type {
  GetStayDetailsQuery,
  GetStayDetailsQueryVariables,
  GetReviewsQuery,
  GetReviewsQueryVariables,
} from '@/types/__generated__/graphql';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AMENITIES_LOOKUP } from '@/constants/amenities';

const MOCK_NAMES = [
  'Gino',
  'Maria',
  'Sophia',
  'Alex',
  'Diego',
  'Paula',
  'Lucas',
  'Elena',
];
const MOCK_DATES = [
  'enero de 2026',
  'febrero de 2026',
  'marzo de 2026',
  'abril de 2026',
  'mayo de 2026',
];
const MOCK_RATINGS = [
  { val: '5.0', text: 'Exceptional' },
  { val: '4.8', text: 'Excellent' },
  { val: '4.9', text: 'Superb' },
  { val: '5.0', text: 'Exceptional' },
];

export default function StayInfoPage() {
  const { id } = useParams<{ id: string }>();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const { data } = useQuery<GetStayDetailsQuery, GetStayDetailsQueryVariables>(
    GET_STAY_DETAILS,
    {
      variables: { id: id ? parseInt(id, 10) : 0 },
      skip: !id,
    },
  );

  const {
    data: reviewsData,
    loading: reviewsLoading,
    error: reviewsError,
  } = useQuery<GetReviewsQuery, GetReviewsQueryVariables>(GET_REVIEWS, {
    variables: { page: 0, size: 10 },
  });

  const stayId = id ? parseInt(id, 10) : 0;
  const stayReviews =
    reviewsData?.reviews.filter((r) => r.stayId === stayId) || [];

  useEffect(() => {
    if (data?.stay) {
      console.log('Stay Details Data:', data.stay);
    }
  }, [data]);

  return (
    <div className="flex-1 w-full bg-background md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        {/* 2. Image Gallery */}
        <StayPhotoGallery images={data?.stay?.pictures?.map((p) => p.url)} />

        {/* Stay Title / Header */}
        <div>
          {data?.stay?.name ? (
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
              {data.stay.name}
            </h1>
          ) : (
            <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          )}
        </div>

        {/* 3. Two-Column Layout (Data on Left, Sticky Sidebar on Right) */}
        {/* `items-start` prevents columns from stretching, enabling the stickiness */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left Side: Additional Data (Spans 2/3 width) */}
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
          </div>
          {/* Right Side: Sticky Booking Widget (Spans 1/3 width) */}
          <div className="sticky top-24 md:col-span-1 w-full">
            {/* Desktop booking widget */}
            <div className="hidden md:block bg-orange-500 text-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Check-in / Check-out</h3>
              {/* Dates & Pricing Details */}
              <p>Booking details go here...</p>
            </div>

            {/* Mobile booking widget */}
            <div className="block md:hidden">
              <BookingWidgetMobile stay={data?.stay} />
            </div>
          </div>
        </div>
        {/* 4. Commentary Section (Outside the Grid) */}
        {/* The sticky sidebar above will stop scrolling before entering this section */}
        <section className="border-t pt-8 mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-frui-blue">
              Reviews & Comments
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
              className={`flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none ${
                stayReviews.length === 1 ? 'justify-center' : 'justify-start'
              }`}
            >
              {stayReviews.map((review) => {
                const name = MOCK_NAMES[review.userId % MOCK_NAMES.length];
                const date = MOCK_DATES[review.id % MOCK_DATES.length];
                const rating = MOCK_RATINGS[review.id % MOCK_RATINGS.length];
                return (
                  <div
                    key={review.id}
                    className="w-[440px] md:w-[320px] min-h-[220px] shrink-0 p-5 rounded-2xl bg-frui-white border border-neutral-100 shadow-xs flex flex-col justify-between snap-start"
                  >
                    <div>
                      {/* Rating Tag */}
                      <span className="inline-block bg-frui-orange/10 text-frui-orange px-2.5 py-1 rounded-md text-xs font-semibold w-fit">
                        {rating.val} {rating.text}
                      </span>
                      {/* Review Text */}
                      <p className="text-sm text-gray-700 leading-relaxed mt-4 line-clamp-4">
                        {review.text}
                      </p>
                    </div>
                    {/* User & Date Footer */}
                    <div className="mt-4 border-t border-neutral-100 pt-3">
                      <div className="text-sm font-bold text-frui-blue">
                        {name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{date}</div>
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
