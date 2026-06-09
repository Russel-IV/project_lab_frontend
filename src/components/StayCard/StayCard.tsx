import { Heart, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { type Stay } from '@/utils/stayMapper';

interface StayCardProps {
  stay: Stay;
  isLiked: boolean;
  onToggleFavorite: (id: string) => void;
}

export function StayCard({ stay, isLiked, onToggleFavorite }: StayCardProps) {
  const formatCLP = (val: number) => {
    return `CLP ${val.toLocaleString('de-DE')}`;
  };

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border border-border shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* Left image area */}
      <div className="relative w-full md:w-[320px] min-h-[220px] bg-muted shrink-0">
        <img
          src={stay.image}
          alt={stay.title}
          className="w-full h-full object-cover select-none"
        />

        {/* Favorite Toggle Button */}
        <button
          onClick={() => onToggleFavorite(stay.id)}
          className="absolute top-3 right-3 bg-white size-8 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border-0"
          aria-label="Add to favorites"
        >
          <Heart
            className={`size-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'
            }`}
          />
        </button>

        {/* Slider Chevrons */}
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
      </div>

      {/* Right content details area */}
      <div className="flex-1 flex flex-col justify-between p-5 md:p-6 gap-4">
        <div className="flex flex-col gap-2">
          {/* Top subinfo */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {stay.distance}
            </span>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground leading-snug m-0">
              {stay.title}
            </h2>
          </div>

          {/* Features (Pool etc.) */}
          {stay.hasPool && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Waves className="size-3.5" />
              <span>Pool</span>
            </div>
          )}

          {/* Highlight block */}
          {stay.highlightTitle && (
            <div className="text-xs mt-1">
              <span className="font-semibold text-foreground block md:inline mr-1">
                {stay.highlightTitle}
              </span>
              <span className="text-muted-foreground leading-relaxed">
                {stay.highlightDesc}
              </span>
            </div>
          )}
        </div>

        {/* Bottom row containing Refund policies and Pricing */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-border/60 pt-4">
          {/* Left side: Refund, Rating */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5 text-xs font-medium text-emerald-600">
              <span>{stay.refundPolicy}</span>
              {stay.reservePolicy && <span>{stay.reservePolicy}</span>}
            </div>

            {/* Rating block */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-800 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                {stay.rating.toFixed(1)}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {stay.ratingText}
              </span>
              <span className="text-xs text-muted-foreground">
                ({stay.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Right side: Pricing */}
          <div className="flex flex-col items-end text-right self-stretch sm:self-auto gap-0.5">
            <div className="text-sm font-bold text-foreground mt-0.5">
              {formatCLP(stay.priceTotal)}{' '}
              <span className="text-xs text-muted-foreground font-normal">
                total
              </span>
            </div>

            <div className="text-[10px] text-muted-foreground">
              for {stay.priceTotalRooms} rooms
            </div>
            <div className="text-[10px] text-muted-foreground leading-none">
              Total with taxes and fees
            </div>

            {stay.availabilityAlert && (
              <div className="text-[10px] text-red-600 font-medium mt-1">
                {stay.availabilityAlert}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
