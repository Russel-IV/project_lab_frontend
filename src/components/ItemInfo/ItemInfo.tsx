import { MapPin, Star } from 'lucide-react';
import { type GetStaysQuery } from '@/types/__generated__/graphql';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { useNavigate } from 'react-router-dom';

type GraphQLStay = GetStaysQuery['stays'][number];

interface ItemInfoProps {
  stay: GraphQLStay | null;
  className?: string;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
];

const getRatingText = (val: number) => {
  if (val >= 4.8) return 'Exceptional';
  if (val >= 4.5) return 'Wonderful';
  if (val >= 4.0) return 'Very Good';
  if (val >= 3.5) return 'Good';
  return 'Fair';
};

export function ItemInfo({ stay, className = '' }: ItemInfoProps) {
  const navigate = useNavigate();

  if (!stay) {
    return (
      <div
        className={`w-full h-full rounded-2xl border border-border bg-card p-8 shadow-sm flex flex-col items-center justify-center text-center ${className}`}
      >
        <div className="max-w-xs flex flex-col items-center gap-4">
          <div className="text-muted-foreground">
            <p className="font-semibold text-lg text-foreground">
              Select a Stay
            </p>
            <p className="text-sm mt-1.5 leading-relaxed">
              Choose a stay from the list to view its pictures, detailed
              description, amenities, and pricing details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Gather pictures, supplementing with fallbacks if there are fewer than 3
  const rawPictures = stay.pictures || [];
  const galleryImages: string[] = [];

  for (let i = 0; i < 3; i++) {
    if (rawPictures[i]?.url) {
      galleryImages.push(rawPictures[i].url);
    } else {
      galleryImages.push(FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]);
    }
  }

  // Format pricing
  const price = (stay.startingFromPrice as number | null) ?? 0;
  const isUSD = price < 10000;
  const formattedPrice = isUSD
    ? `$${price}`
    : `CLP ${price.toLocaleString('de-DE')}`;

  const rating = (stay.starRating as number | null) ?? 4.8;
  const ratingText = getRatingText(rating);

  // Map amenities
  const amenities = (stay.amenities || [])
    .map((a) => AMENITIES_LOOKUP[a.id])
    .filter(Boolean);

  return (
    <div
      className={`w-full h-full rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden ${className}`}
    >
      {/* Scrollable details view */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* 1. Image Gallery using CSS Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-xs shrink-0">
          {/* Main Image */}
          <div className="col-span-2 row-span-2 relative overflow-hidden bg-muted">
            <img
              src={galleryImages[0]}
              alt={`${stay.name} - main view`}
              className="absolute inset-0 w-full h-full object-cover select-none hover:scale-103 transition-transform duration-500"
            />
          </div>
          {/* Top Sub-image */}
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-muted">
            <img
              src={galleryImages[1]}
              alt={`${stay.name} - details 1`}
              className="absolute inset-0 w-full h-full object-cover select-none hover:scale-103 transition-transform duration-500"
            />
          </div>
          {/* Bottom Sub-image */}
          <div className="col-span-1 row-span-1 relative overflow-hidden bg-muted">
            <img
              src={galleryImages[2]}
              alt={`${stay.name} - details 2`}
              className="absolute inset-0 w-full h-full object-cover select-none hover:scale-103 transition-transform duration-500"
            />
          </div>
        </div>

        {/* 2. Title & Metadata Header */}
        <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
            {stay.name}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
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

        {/* 4. Amenities section */}
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
      </div>

      {/* 5. Sticky Footer container */}
      <div className="border-t border-border bg-card p-5 shrink-0 flex items-center justify-between z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-0.5">
          <div className="text-lg font-bold text-foreground">
            {formattedPrice}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              total
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground leading-none">
            Includes all taxes and booking fees
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/stay/${stay.id}`)}
            className="bg-[#a75d2e] hover:bg-[#924f24] active:scale-[0.98] text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm select-none text-sm cursor-pointer border-0"
          >
            More Information
          </button>
          <button className="bg-[#a75d2e] hover:bg-[#924f24] active:scale-[0.98] text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm select-none text-sm cursor-pointer border-0">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
