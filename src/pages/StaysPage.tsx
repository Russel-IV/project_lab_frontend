import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { staysData } from '@/lib/staysData';

export default function StaysPage() {
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const selection = searchParams.get('selection') || 'None';
  const dates = searchParams.get('dates') || 'None';
  const travelers = searchParams.get('travelers') || 'None';

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatCLP = (val: number) => {
    return `CLP ${val.toLocaleString('de-DE')}`;
  };

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* Header section showing current query */}
        <div className="flex flex-col gap-2 border-b border-border pb-6">
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline self-start"
          >
            &larr; Back to Search
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
            Available Stays in Palma
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing stays for{' '}
            <span className="font-semibold text-foreground">{selection}</span> •{' '}
            <span className="font-semibold text-foreground">{dates}</span> •{' '}
            <span className="font-semibold text-foreground">{travelers}</span>
          </p>
        </div>

        {/* Main layout container with sidebar on the left and stays list on the right */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Filter Bar */}
          <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-8 bg-card p-6 rounded-xl border border-border">
            {/* Section 1: Popular filters */}
            <div className="flex flex-col gap-3.5">
              <h3 className="font-bold text-foreground text-sm tracking-tight m-0">
                Popular filters
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Checkbox id="pop-breakfast" />
                  <label
                    htmlFor="pop-breakfast"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Breakfast included (74)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="pop-pool" />
                  <label
                    htmlFor="pop-pool"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Pool (82)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="pop-hotel" />
                  <label
                    htmlFor="pop-hotel"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Hotel (75)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="pop-pay-later" />
                  <label
                    htmlFor="pop-pay-later"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Reserve now, pay later (43)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="pop-all-inclusive" />
                  <label
                    htmlFor="pop-all-inclusive"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    All inclusive (24)
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Meal plans available */}
            <div className="flex flex-col gap-3.5">
              <h3 className="font-bold text-foreground text-sm tracking-tight m-0">
                Meal plans available
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Checkbox id="meal-breakfast" />
                  <label
                    htmlFor="meal-breakfast"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Breakfast included (74)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="meal-all-inclusive" />
                  <label
                    htmlFor="meal-all-inclusive"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    All inclusive (24)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="meal-lunch" />
                  <label
                    htmlFor="meal-lunch"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Lunch included
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="meal-dinner" />
                  <label
                    htmlFor="meal-dinner"
                    className="text-sm text-foreground font-medium cursor-pointer"
                  >
                    Dinner included
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Star rating */}
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-foreground text-sm tracking-tight m-0">
                  Star rating
                </h3>
                <span className="text-xs font-bold text-foreground">From</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <Checkbox id="star-5" />
                    <label
                      htmlFor="star-5"
                      className="text-sm text-foreground font-medium cursor-pointer"
                    >
                      5 stars (19)
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    CLP 2.468.386
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <Checkbox id="star-4" />
                    <label
                      htmlFor="star-4"
                      className="text-sm text-foreground font-medium cursor-pointer"
                    >
                      4 stars (41)
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    CLP 1.475.838
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <Checkbox id="star-3" />
                    <label
                      htmlFor="star-3"
                      className="text-sm text-foreground font-medium cursor-pointer"
                    >
                      3 stars (21)
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    CLP 947.548
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom link: See more */}
            <button className="text-left text-sm font-semibold text-primary hover:underline cursor-pointer border-0 bg-transparent p-0">
              See more
            </button>
          </div>

          {/* Stays List */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {staysData.map((stay) => {
              const isLiked = !!favorites[stay.id];
              return (
                <Card
                  key={stay.id}
                  className="flex flex-col md:flex-row overflow-hidden border border-border shadow-xs hover:shadow-md transition-shadow duration-200"
                >
                  {/* Left image area */}
                  <div className="relative w-full md:w-[320px] min-h-[220px] bg-muted shrink-0">
                    <img
                      src={stay.image}
                      alt={stay.title}
                      className="w-full h-full object-cover select-none"
                    />
                    {/* VIP Access Badge */}
                    {stay.vipAccess && (
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant="default"
                          className="bg-slate-900 text-white border-0 text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-sm"
                        >
                          VIP Access
                        </Badge>
                      </div>
                    )}

                    {/* Favorite Toggle Button */}
                    <button
                      onClick={() => toggleFavorite(stay.id)}
                      className="absolute top-3 right-3 bg-white size-8 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border-0"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`size-4 transition-colors ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'
                        }`}
                      />
                    </button>

                    {/* Ad Indicator */}
                    {stay.isAd && (
                      <div className="absolute bottom-3 left-3 bg-white/90 text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-xs font-medium border border-border">
                        Ad
                      </div>
                    )}

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
                          {stay.reservePolicy && (
                            <span>{stay.reservePolicy}</span>
                          )}
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
                        <div className="text-sm font-semibold text-foreground">
                          {formatCLP(stay.priceNightly)}{' '}
                          <span className="text-xs text-muted-foreground font-normal">
                            nightly
                          </span>
                        </div>

                        {stay.originalPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCLP(stay.originalPrice)}
                          </div>
                        )}

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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
