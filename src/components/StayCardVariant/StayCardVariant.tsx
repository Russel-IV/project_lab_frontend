import React, { createContext, useContext, useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import { type GetStaysQuery } from '@/types/__generated__/graphql';
import type { ReviewSummaryData } from '@/hooks/useReviewSummaries';
import { useAppSelector } from '@/store/hooks';
import { buildSrcSet } from '@/lib/images';

export type GraphQLStay = GetStaysQuery['stays']['items'][number];

interface StayCardVariantContextType {
  stay: GraphQLStay;
  reviewSummary?: ReviewSummaryData | null;
  reviewSummaryLoading?: boolean;
  priority?: boolean;
}

const StayCardVariantContext = createContext<
  StayCardVariantContextType | undefined
>(undefined);

function useStayCardVariantContext() {
  const context = useContext(StayCardVariantContext);
  if (!context) {
    throw new Error(
      'StayCardVariant sub-components must be used within a StayCardVariant provider',
    );
  }
  return context;
}

interface StayCardVariantProps {
  stay: GraphQLStay;
  children?: React.ReactNode;
  isLiked?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClick?: () => void;
  isActive?: boolean;
  reviewSummary?: ReviewSummaryData | null;
  reviewSummaryLoading?: boolean;
  /** First-row cards: skip lazy-loading so the likely LCP image isn't deferred. */
  priority?: boolean;
}

export function StayCardVariant({
  stay,
  isLiked,
  onToggleFavorite,
  onClick,
  reviewSummary,
  reviewSummaryLoading,
  priority,
}: StayCardVariantProps) {
  const cardContent = (
    <>
      <StayCardVariant.Image />
      <StayCardVariant.Rating />
      {onToggleFavorite && (
        <StayCardVariant.FavoriteButton
          isLiked={!!isLiked}
          onToggle={onToggleFavorite}
        />
      )}
      <StayCardVariant.BottomSection>
        <div className="flex justify-between items-end w-full h-full">
          <div className="flex flex-col gap-1 text-left">
            <StayCardVariant.Title />
            <StayCardVariant.Location />
          </div>
          <div className="text-right">
            <StayCardVariant.Pricing />
          </div>
        </div>
      </StayCardVariant.BottomSection>
    </>
  );

  const containerClasses = `group relative overflow-hidden w-full aspect-[4/3] rounded-2xl shadow-xs cursor-pointer p-0 bg-muted border block no-underline text-inherit`;

  return (
    <StayCardVariantContext.Provider
      value={{ stay, reviewSummary, reviewSummaryLoading, priority }}
    >
      <Link
        to={`/stay/${stay.publicId}`}
        className={`${containerClasses} md:hidden`}
      >
        {cardContent}
      </Link>

      <div onClick={onClick} className={`${containerClasses} hidden md:block`}>
        {cardContent}
      </div>
    </StayCardVariantContext.Provider>
  );
}

export function StayCardVariantImage() {
  const { stay, priority } = useStayCardVariantContext();
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryPicture =
    stay.pictures?.find((p) => p.isPrimary) ?? stay.pictures?.[0];

  if (!primaryPicture || imageFailed) {
    return (
      <div className="absolute inset-0 w-full h-full bg-frui-placeholder animate-pulse" />
    );
  }

  const { src, srcSet } = buildSrcSet(primaryPicture);

  return (
    <>
      {!imageLoaded && (
        <div className="absolute inset-0 w-full h-full bg-frui-placeholder animate-pulse" />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        alt={stay.name}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageFailed(true)}
        className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}

export function StayCardVariantFavoriteButton({
  isLiked,
  onToggle,
}: {
  isLiked: boolean;
  onToggle: (id: string) => void;
}) {
  const { stay } = useStayCardVariantContext();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(stay.id.toString());
      }}
      className="absolute top-4 right-4 bg-white size-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border-0 z-10"
      aria-label="Add to favorites"
    >
      <Heart
        className={`size-5 transition-colors duration-200 stroke-frui-orange stroke-[2px] ${
          isLiked ? 'fill-frui-orange text-frui-orange' : 'text-frui-orange'
        }`}
      />
    </button>
  );
}

export function StayCardVariantBottomSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-frui-blue/90 via-frui-blue/60 to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">
      <div className="pointer-events-auto w-full">{children}</div>
    </div>
  );
}

export function StayCardVariantTitle() {
  const { stay } = useStayCardVariantContext();
  return (
    <h2 className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug m-0 drop-shadow-sm line-clamp-1">
      {stay.name}
    </h2>
  );
}

export function StayCardVariantLocation() {
  const { stay } = useStayCardVariantContext();
  const city = stay.address?.city || 'Malibu';
  const stateProvince =
    stay.address?.stateProvince || stay.address?.countryCode || 'California';
  return (
    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-200/90 font-medium">
      <MapPin className="size-4 shrink-0 text-gray-300" />
      <span>
        {city}, {stateProvince}
      </span>
    </div>
  );
}

export function StayCardVariantRating() {
  const { stay, reviewSummary, reviewSummaryLoading } =
    useStayCardVariantContext();

  // Falls back to Stay.starRating (a separate, host-set field) only when
  // there are no reviews yet.
  const loading = !!reviewSummaryLoading;
  const reviewAverage =
    reviewSummary && reviewSummary.count > 0 && reviewSummary.average !== null
      ? reviewSummary.average
      : null;
  const rating =
    reviewAverage ??
    (typeof stay.starRating === 'number' ? stay.starRating : null);

  const getRatingText = (val: number) => {
    if (val >= 4.8) return 'Exceptional';
    if (val >= 4.5) return 'Wonderful';
    if (val >= 4.0) return 'Very Good';
    if (val >= 3.5) return 'Good';
    return 'Fair';
  };

  if (rating === null) {
    if (loading) {
      return (
        <div className="absolute top-4 left-4 h-[22px] w-24 rounded-md bg-white/70 animate-pulse z-10" />
      );
    }
    return null;
  }

  const isHighlyRated = rating >= 4.5;

  return (
    <div className="absolute top-4 left-4 bg-white flex items-center gap-1 text-[11px] md:text-xs font-semibold px-2 py-0.5 rounded-md shadow-xs z-10">
      {isHighlyRated && (
        <Star className="size-3 shrink-0 fill-frui-orange text-frui-orange" />
      )}
      <span
        className={isHighlyRated ? 'text-frui-orange-text' : 'text-slate-900'}
      >
        {rating.toFixed(1)} {getRatingText(rating)}
      </span>
    </div>
  );
}

export function StayCardVariantPricing() {
  const { stay } = useStayCardVariantContext();
  const { checkIn, checkOut } = useAppSelector((state) => state.search);

  // startingFromPrice is a per-night rate, not a total.
  const nights = Math.max(
    1,
    differenceInCalendarDays(new Date(checkOut), new Date(checkIn)),
  );
  const nightlyPrice =
    typeof stay.startingFromPrice === 'number' ? stay.startingFromPrice : 0;
  const price = nightlyPrice * nights;

  const isUSD = price < 10000;
  const formattedPrice = isUSD
    ? `$${price}`
    : `CLP ${price.toLocaleString('de-DE')}`;

  return (
    <div className="flex flex-col items-end text-white select-none">
      <span className="text-sm md:text-base font-semibold tracking-tight drop-shadow-sm">
        {formattedPrice}
      </span>
      <span className="text-[11px] md:text-xs text-gray-300/90 font-normal leading-none mt-0.5">
        total
      </span>
    </div>
  );
}

StayCardVariant.Image = StayCardVariantImage;
StayCardVariant.FavoriteButton = StayCardVariantFavoriteButton;
StayCardVariant.BottomSection = StayCardVariantBottomSection;
StayCardVariant.Title = StayCardVariantTitle;
StayCardVariant.Location = StayCardVariantLocation;
StayCardVariant.Rating = StayCardVariantRating;
StayCardVariant.Pricing = StayCardVariantPricing;
