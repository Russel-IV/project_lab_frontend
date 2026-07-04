import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { type GetStaysQuery } from '@/types/__generated__/graphql';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import { useNavigate } from 'react-router-dom';
import { ImageGalleryModal } from '@/components/PhotoGallery/ImageGalleryModal';

type GraphQLStay = GetStaysQuery['stays'][number];

interface ItemInfoProps {
  stay: GraphQLStay | null;
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

export function ItemInfo({ stay, className = '' }: ItemInfoProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
