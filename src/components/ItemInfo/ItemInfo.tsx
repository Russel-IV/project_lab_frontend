import { useState } from 'react';
import { MapPin, Star, X, Home, Building2 } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import type {
  GetStayDetailsQuery,
  GetReviewsByStayQuery,
  GetReviewsByStayQueryVariables,
} from '@/types/__generated__/graphql';
import { GET_REVIEWS_BY_STAY } from '@/graphql/reviews';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { ImageGalleryModal } from '@/components/PhotoGallery/ImageGalleryModal';
import { Skeleton } from '@/components/ui/skeleton';

type GraphQLStay = NonNullable<GetStayDetailsQuery['stay']>;

interface ItemInfoProps {
  stay: GraphQLStay;
  onClose: () => void;
  className?: string;
}

interface GalleryTileProps {
  src?: string;
  alt: string;
  className: string;
  onClick: () => void;
}

/**
 * GalleryTile
 *
 * Renders one grid cell of the stay's image preview. Falls back to the
 * branded placeholder pattern when there's no picture, or when the image
 * fails to load, and disables the click-to-expand behavior in that case.
 */
function GalleryTile({ src, alt, className, onClick }: GalleryTileProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div
      onClick={showPlaceholder ? undefined : onClick}
      className={`relative overflow-hidden bg-muted ${showPlaceholder ? '' : 'cursor-pointer'} ${className}`}
    >
      {showPlaceholder ? (
        <div className="absolute inset-0 w-full h-full bg-frui-placeholder animate-pulse" />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover select-none hover:brightness-80"
        />
      )}
    </div>
  );
}

const getRatingText = (val: number) => {
  if (val >= 4.8) return 'Exceptional';
  if (val >= 4.5) return 'Wonderful';
  if (val >= 4.0) return 'Very Good';
  if (val >= 3.5) return 'Good';
  return 'Fair';
};

export function ItemInfo({ stay, onClose, className = '' }: ItemInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  const { data: reviewsData, loading: reviewsLoading } = useQuery<
    GetReviewsByStayQuery,
    GetReviewsByStayQueryVariables
  >(GET_REVIEWS_BY_STAY, {
    variables: { stayId: stay.id, page: 0, size: 10 },
    skip: !showReviews,
  });

  // Gather up to 3 pictures for the preview grid; missing slots render the
  // branded placeholder instead of a stock fallback photo.
  const rawPictures = stay.pictures || [];
  const galleryImages: (string | undefined)[] = [0, 1, 2].map(
    (i) => rawPictures[i]?.url,
  );

  const allImages = rawPictures.map((p) => p.url);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  // Format pricing
  const price =
    typeof stay.startingFromPrice === 'number' ? stay.startingFromPrice : 0;
  const isUSD = price < 10000;
  const formattedPrice = isUSD
    ? `$${price}`
    : `CLP ${price.toLocaleString('de-DE')}`;

  const rating = typeof stay.starRating === 'number' ? stay.starRating : 4.8;
  const ratingText = getRatingText(rating);

  const propertyTypeLabel = stay.propertyType === 'HOME' ? 'Home' : 'Hotel';
  const PropertyTypeIcon = stay.propertyType === 'HOME' ? Home : Building2;

  // Map amenities
  const amenities = (stay.amenities || [])
    .map((a) => AMENITIES_LOOKUP[a.id])
    .filter(Boolean);

  const stayReviews = reviewsData?.reviewsByStay || [];

  return (
    <div
      className={`relative w-full h-full rounded-2xl border border-border bg-card shadow-xl flex flex-col overflow-hidden ${className}`}
    >
      {/* Close button floats above the scrollable content */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close stay details"
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-frui-white border border-neutral-200 shadow-md hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
      >
        <X className="w-5 h-5 text-frui-blue" />
      </button>

      {/* Scrollable details view */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* 1. Image Gallery using CSS Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-xs shrink-0">
          <GalleryTile
            src={galleryImages[0]}
            alt={`${stay.name} - main view`}
            className="col-span-2 row-span-2"
            onClick={() => handleImageClick(0)}
          />
          <GalleryTile
            src={galleryImages[1]}
            alt={`${stay.name} - details 1`}
            className="col-span-1 row-span-1"
            onClick={() => handleImageClick(1)}
          />
          <GalleryTile
            src={galleryImages[2]}
            alt={`${stay.name} - details 2`}
            className="col-span-1 row-span-1"
            onClick={() => handleImageClick(2)}
          />
        </div>

        {/* 2. Title & Metadata Header, with pricing + reserve to the right
            on wider views; stacked full-width on narrow/mobile widths so the
            title isn't squeezed into a cramped column. */}
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
                <span className="text-muted-foreground text-xs">
                  (124 reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0 text-right">
            <div>
              <div className="text-lg font-bold text-foreground">
                {formattedPrice}
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  total
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Includes all taxes and fees
              </div>
            </div>
            <button
              type="button"
              className="bg-frui-orange hover:bg-frui-orange/90 active:scale-[0.98] text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm select-none text-sm cursor-pointer border-0"
            >
              Reserve
            </button>
          </div>
        </div>

        {/* 3. About section */}
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

        {/* 4. Location Details -- shown by default (full address), not
            gated behind an extra click. */}
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

        {/* 5. Amenities section */}
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

        {/* 6. Reviews toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowReviews((prev) => !prev)}
            className="text-sm font-semibold text-frui-orange hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            {showReviews ? 'Hide reviews' : 'Show reviews'}
          </button>
        </div>

        {/* 7. Expanded content: Reviews */}
        {showReviews && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
              Reviews & Comments
            </h3>
            {reviewsLoading && (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, idx) => (
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
            )}
            {!reviewsLoading && stayReviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No reviews have been done yet.
              </p>
            )}
            {!reviewsLoading && stayReviews.length > 0 && (
              <div className="flex flex-col gap-3">
                {stayReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col gap-2"
                  >
                    <span className="inline-block bg-frui-orange/10 text-frui-orange px-2.5 py-1 rounded-md text-xs font-semibold w-fit">
                      {review.rating.toFixed(1)}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>
                    <div className="text-sm font-bold text-foreground">
                      {review.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ImageGalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={allImages}
          initialIndex={selectedImageIndex}
        />
      )}
    </div>
  );
}
