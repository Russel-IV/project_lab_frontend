import React, { createContext, useContext } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { type StayDto } from '@/dtos/stayDTO';
import { AMENITIES_LOOKUP } from '@/constants/amenities';

interface StayCardContextType {
  stay: StayDto;
}

const StayCardContext = createContext<StayCardContextType | undefined>(
  undefined,
);

function useStayCardContext() {
  const context = useContext(StayCardContext);
  if (!context) {
    throw new Error(
      'StayCard sub-components must be used within a StayCard provider',
    );
  }
  return context;
}

interface StayCardProps {
  stay: StayDto;
  children?: React.ReactNode;
  isLiked?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function StayCard({
  stay,
  children,
  isLiked,
  onToggleFavorite,
}: StayCardProps) {
  return (
    <StayCardContext.Provider value={{ stay }}>
      <Card className="flex flex-col md:flex-row overflow-hidden border border-border shadow-xs hover:shadow-md transition-shadow duration-200">
        {children ? (
          children
        ) : (
          <>
            <StayCard.Left>
              <StayCard.Image />
              {onToggleFavorite && (
                <StayCard.FavoriteButton
                  isLiked={!!isLiked}
                  onToggle={onToggleFavorite}
                />
              )}
              <StayCard.Navigation />
            </StayCard.Left>
            <StayCard.Right>
              <StayCard.Header>
                <StayCard.Distance />
                <StayCard.Title />
                <StayCard.Features />
                <StayCard.Highlight />
              </StayCard.Header>
              <StayCard.Footer>
                <StayCard.LeftFooterSection>
                  <StayCard.RefundPolicies />
                  <StayCard.Rating />
                </StayCard.LeftFooterSection>
                <StayCard.RightFooterSection>
                  <StayCard.Pricing />
                </StayCard.RightFooterSection>
              </StayCard.Footer>
            </StayCard.Right>
          </>
        )}
      </Card>
    </StayCardContext.Provider>
  );
}

// Sub-components

export function StayCardLeft({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full md:w-[320px] min-h-[220px] bg-muted shrink-0">
      {children}
    </div>
  );
}

export function StayCardImage() {
  const { stay } = useStayCardContext();
  return (
    <img
      src={stay.pictures[0].url}
      alt="Stay Image"
      className="w-full h-full object-cover select-none"
    />
  );
}

export function StayCardFavoriteButton({
  isLiked,
  onToggle,
}: {
  isLiked: boolean;
  onToggle: (id: string) => void;
}) {
  const { stay } = useStayCardContext();
  return (
    <button
      onClick={() => onToggle(stay.id.toString())}
      className="absolute top-3 right-3 bg-white size-8 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border-0"
      aria-label="Add to favorites"
    >
      <Heart
        className={`size-4 transition-colors ${
          isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'
        }`}
      />
    </button>
  );
}

export function StayCardNavigation() {
  return (
    <>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white size-7 rounded-full flex items-center justify-center cursor-pointer border-0"
        aria-label="Previous image"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white size-7 rounded-full flex items-center justify-center cursor-pointer border-0"
        aria-label="Next image"
      >
        <ChevronRight className="size-4" />
      </button>
    </>
  );
}

export function StayCardRight({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col justify-between p-5 md:p-6 gap-4">
      {children}
    </div>
  );
}

export function StayCardHeader({ children }: { children?: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function StayCardDistance() {
  return (
    <span className="text-xs text-muted-foreground">
      1 mi from Playa de Palma
    </span>
  );
}

export function StayCardTitle() {
  const { stay } = useStayCardContext();
  return (
    <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground leading-snug m-0">
      {stay.name}
    </h2>
  );
}

export function StayCardFeatures() {
  const { stay } = useStayCardContext();

  const features = (stay.amenityIds || [])
    .map((id) => AMENITIES_LOOKUP[id])
    .filter(Boolean);

  if (features.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <Icon className="size-3.5" />
            <span>{feature.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StayCardHighlight() {
  return (
    <div className="text-xs mt-1">
      <span className="font-semibold text-foreground block md:inline mr-1">
        Ideally located in Palma
      </span>
      <span className="text-muted-foreground leading-relaxed">
        Excellent hotel near the sea with a rooftop pool and specialty
        restaurant.
      </span>
    </div>
  );
}

export function StayCardFooter({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-border/60 pt-4">
      {children}
    </div>
  );
}

export function StayCardLeftFooterSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

export function StayCardRightFooterSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-end text-right self-stretch sm:self-auto gap-0.5">
      {children}
    </div>
  );
}

export function StayCardRefundPolicies() {
  const { stay } = useStayCardContext();
  return (
    <div className="flex flex-col gap-0.5 text-xs font-medium text-emerald-600">
      <span>{stay.isRefundable ? 'Fully refundable' : 'Non-refundable'}</span>
      <span>Reserve now, pay later</span>
    </div>
  );
}

export function StayCardRating() {
  const { stay } = useStayCardContext();
  const rating = stay.starRating ?? 8.5;
  return (
    <div className="flex items-center gap-2">
      <div className="bg-emerald-800 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
        {rating.toFixed(1)}
      </div>
      <span className="text-xs font-semibold text-foreground">Wonderful</span>
      <span className="text-xs text-muted-foreground">(120 reviews)</span>
    </div>
  );
}

export function StayCardPricing() {
  const { stay } = useStayCardContext();
  const formatCLP = (val: number) => {
    return `CLP ${val.toLocaleString('de-DE')}`;
  };
  const price = stay.startingFromPrice ?? 0;
  const bedroomAmount =
    stay.rooms?.reduce((sum, r) => sum + r.bedroomAmount, 0) ?? 0;
  const isAvailable = stay.rooms && stay.rooms.length > 0;

  return (
    <>
      <div className="text-sm font-bold text-foreground mt-0.5">
        {formatCLP(price)}{' '}
        <span className="text-xs text-muted-foreground font-normal">total</span>
      </div>

      <div className="text-[10px] text-muted-foreground">
        for {bedroomAmount} rooms
      </div>
      <div className="text-[10px] text-muted-foreground leading-none">
        Total with taxes and fees
      </div>

      {isAvailable ? null : (
        <div className="text-[10px] text-red-600 font-medium mt-1">
          Currently unavailable
        </div>
      )}
    </>
  );
}

StayCard.Left = StayCardLeft;
StayCard.Image = StayCardImage;
StayCard.FavoriteButton = StayCardFavoriteButton;
StayCard.Navigation = StayCardNavigation;
StayCard.Right = StayCardRight;
StayCard.Header = StayCardHeader;
StayCard.Distance = StayCardDistance;
StayCard.Title = StayCardTitle;
StayCard.Features = StayCardFeatures;
StayCard.Highlight = StayCardHighlight;
StayCard.Footer = StayCardFooter;
StayCard.LeftFooterSection = StayCardLeftFooterSection;
StayCard.RightFooterSection = StayCardRightFooterSection;
StayCard.RefundPolicies = StayCardRefundPolicies;
StayCard.Rating = StayCardRating;
StayCard.Pricing = StayCardPricing;
