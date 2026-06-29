import StayPhotoGallery from '@/StayPhotoGallery/StayPhotoGallery';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { GET_STAY_DETAILS } from '@/graphql/stays';
import { GET_REVIEWS } from '@/graphql/reviews';
import type {
  GetStayDetailsQuery,
  GetStayDetailsQueryVariables,
  GetReviewsQuery,
  GetReviewsQueryVariables,
} from '@/types/__generated__/graphql';

export default function StayInfoPage() {
  const { id } = useParams<{ id: string }>();

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
    <div className="flex-1 w-full bg-background py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        {/* 1. Stay Title / Header */}
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
            Beach House | Viña del Mar
          </h1>
        </div>

        {/* 2. Image Gallery */}
        <StayPhotoGallery />
        {/* 3. Two-Column Layout (Data on Left, Sticky Sidebar on Right) */}
        {/* `items-start` prevents columns from stretching, enabling the stickiness */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left Side: Additional Data (Spans 2/3 width) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <section className="border-b pb-6">
              Place Info & Description
            </section>
            <section className="border-b pb-6">Amenities</section>
            <section className="border-b pb-6">Location Details</section>
          </div>
          {/* Right Side: Sticky Booking Widget (Spans 1/3 width) */}
          <div className="sticky top-24 md:col-span-1">
            <div className="bg-orange-500 text-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Check-in / Check-out</h3>
              {/* Dates & Pricing Details */}
              <p>Booking details go here...</p>
            </div>
          </div>
        </div>
        {/* 4. Commentary Section (Outside the Grid) */}
        {/* The sticky sidebar above will stop scrolling before entering this section */}
        <section className="border-t pt-8 mt-4">
          <h2 className="text-xl font-semibold mb-4 text-frui-blue">
            Reviews & Comments
          </h2>
          {reviewsLoading && (
            <p className="text-sm text-gray-500">Loading reviews...</p>
          )}
          {reviewsError && (
            <p className="text-sm text-red-500">
              Error loading reviews: {reviewsError.message}
            </p>
          )}
          {!reviewsLoading && !reviewsError && stayReviews.length === 0 && (
            <p className="text-sm text-gray-500">
              No reviews found for this stay.
            </p>
          )}
          {!reviewsLoading && !reviewsError && stayReviews.length > 0 && (
            <div className="flex flex-col gap-4">
              {stayReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg bg-frui-cream border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-frui-blue">
                      User #{review.userId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
