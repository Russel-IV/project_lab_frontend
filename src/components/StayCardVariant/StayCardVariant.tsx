import React, { createContext, useContext } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type GetStaysQuery } from '@/types/__generated__/graphql';

export type GraphQLStay = GetStaysQuery['stays'][number];

interface StayCardVariantContextType {
  stay: GraphQLStay;
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
}

export function StayCardVariant({
  stay,
  isLiked,
  onToggleFavorite,
  onClick,
  //isActive,
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
    <StayCardVariantContext.Provider value={{ stay }}>
      {/* Mobile view: Direct Link to StayInfoPage */}
      <Link to={`/stay/${stay.id}`} className={`${containerClasses} md:hidden`}>
        {cardContent}
      </Link>

      {/* Desktop view: Interactive selection handler */}
      <div onClick={onClick} className={`${containerClasses} hidden md:block`}>
        {cardContent}
      </div>
    </StayCardVariantContext.Provider>
  );
}

// Subcomponents

export function StayCardVariantImage() {
  const { stay } = useStayCardVariantContext();
  const imageUrl =
    stay.pictures?.[0]?.url ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
  return (
    <img
      src={imageUrl}
      alt={stay.name}
      className="absolute inset-0 w-full h-full object-cover select-none"
    />
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
        e.stopPropagation(); // prevent card click
        onToggle(stay.id.toString());
      }}
      className="absolute top-4 right-4 bg-white size-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border-0 z-10"
      aria-label="Add to favorites"
    >
      <Heart
        className={`size-5 transition-colors duration-200 stroke-[#a75d2e] stroke-[2px] ${
          isLiked ? 'fill-[#a75d2e] text-[#a75d2e]' : 'text-[#a75d2e]'
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
    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">
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
  const { stay } = useStayCardVariantContext();
  const rating = (stay.starRating as number | null) ?? 4.9;

  const getRatingText = (val: number) => {
    if (val <= 5) {
      if (val >= 4.8) return 'Exceptional';
      if (val >= 4.5) return 'Wonderful';
      if (val >= 4.0) return 'Very Good';
      if (val >= 3.5) return 'Good';
      return 'Fair';
    } else {
      if (val >= 9.5) return 'Exceptional';
      if (val >= 9.0) return 'Wonderful';
      if (val >= 8.0) return 'Very Good';
      if (val >= 7.0) return 'Good';
      return 'Fair';
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white text-slate-900 text-xs md:text-sm font-semibold px-3 py-1 rounded-md shadow-xs z-10">
      {rating.toFixed(1)} {getRatingText(rating)}
    </div>
  );
}

export function StayCardVariantPricing() {
  const { stay } = useStayCardVariantContext();
  const price = (stay.startingFromPrice as number | null) ?? 0;

  // Decide whether USD or CLP depending on numeric value
  const isUSD = price < 10000;
  const formattedPrice = isUSD
    ? `$${price}`
    : `CLP ${price.toLocaleString('de-DE')}`;

  return (
    <div className="flex flex-col items-end text-white select-none">
      <span className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-sm">
        {formattedPrice}
      </span>
      <span className="text-xs md:text-sm text-gray-300/90 font-normal leading-none mt-0.5">
        total
      </span>
    </div>
  );
}

// Attach subcomponents
StayCardVariant.Image = StayCardVariantImage;
StayCardVariant.FavoriteButton = StayCardVariantFavoriteButton;
StayCardVariant.BottomSection = StayCardVariantBottomSection;
StayCardVariant.Title = StayCardVariantTitle;
StayCardVariant.Location = StayCardVariantLocation;
StayCardVariant.Rating = StayCardVariantRating;
StayCardVariant.Pricing = StayCardVariantPricing;
