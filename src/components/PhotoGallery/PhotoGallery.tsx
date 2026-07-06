import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { usePhotoGallery } from './usePhotoGallery';
import { ImageGalleryModal } from './ImageGalleryModal';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
];

export interface PhotoGalleryProps {
  images?: string[];
  maxPhotos?: 3 | 5;
  useFallbacks?: boolean;
  responsive?: boolean;
  className?: string;
}

export function PhotoGallery({
  images = [],
  maxPhotos = 5,
  useFallbacks = false,
  responsive = maxPhotos === 5,
  className = '',
}: PhotoGalleryProps) {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Compute display list with optional padding
  const rawPictures = images || [];
  const displayImages = [...rawPictures];
  if (useFallbacks && displayImages.length < maxPhotos) {
    for (let i = displayImages.length; i < maxPhotos; i++) {
      displayImages.push(FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]);
    }
  }

  const gallery = usePhotoGallery({ images: displayImages, maxPhotos });

  if (gallery.images.length === 0) {
    const skeletonClasses = responsive
      ? 'w-auto aspect-[4/3] md:aspect-[2/1] rounded-2xl bg-frui-placeholder animate-pulse -mx-4 sm:-mx-6 md:mx-0'
      : 'w-full aspect-[16/10] rounded-2xl bg-frui-placeholder animate-pulse';
    return <div className={skeletonClasses} />;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    gallery.openModal();
  };

  const wrapperClasses = `${
    responsive
      ? 'w-auto relative select-none -mx-4 sm:-mx-6 md:mx-0'
      : 'w-auto relative select-none'
  } ${className}`;

  const aspectClass = responsive
    ? 'w-full aspect-[4/3] md:aspect-[2/1] md:rounded-2xl overflow-hidden shadow-sm bg-frui-white'
    : 'w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xs shrink-0 bg-frui-white';

  // Render Three Grid structure (flat structure using row spans)
  const renderThreeGrid = () => (
    <>
      {/* Main Image */}
      <div
        onClick={() => handleImageClick(0)}
        className="col-span-2 row-span-2 relative overflow-hidden bg-frui-placeholder cursor-pointer"
      >
        <img
          src={gallery.visibleImages[0]}
          alt="Main view"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
      </div>
      {/* Sub Images */}
      {gallery.visibleImages.slice(1, 3).map((img, index) => (
        <div
          key={index}
          onClick={() => handleImageClick(index + 1)}
          className="col-span-1 row-span-1 relative overflow-hidden bg-frui-placeholder cursor-pointer"
        >
          <img
            src={img}
            alt={`Detail view ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />
          {/* Overlay badge on the last image (index 1 of slice, i.e. 3rd photo) */}
          {index === 1 && gallery.images.length > 3 && (
            <div className="absolute bottom-3 right-3 bg-frui-blue/70 text-frui-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] sm:text-xs font-semibold shadow-md pointer-events-none">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{gallery.images.length}+</span>
            </div>
          )}
        </div>
      ))}
    </>
  );

  // Render Five Grid structure (flat structure using row spans)
  const renderFiveGrid = () => (
    <>
      {/* Main Image */}
      <div
        onClick={() => handleImageClick(0)}
        className="col-span-2 row-span-2 relative overflow-hidden bg-frui-placeholder cursor-pointer"
      >
        <img
          src={gallery.visibleImages[0]}
          alt="Main view"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
      </div>
      {/* Sub Images */}
      {gallery.visibleImages.slice(1, 5).map((img, index) => (
        <div
          key={index}
          onClick={() => handleImageClick(index + 1)}
          className="col-span-1 row-span-1 relative overflow-hidden bg-frui-placeholder cursor-pointer"
        >
          <img
            src={img}
            alt={`Detail view ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />
          {/* Overlay badge on the last image (index 3 of slice, i.e. 5th photo) */}
          {index === 3 && gallery.images.length > 5 && (
            <div className="absolute bottom-3 right-3 bg-frui-blue/70 text-frui-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] sm:text-xs font-semibold shadow-md pointer-events-none">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{gallery.images.length}+</span>
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className={wrapperClasses}>
      {/* Mobile Floating Back Button */}
      {responsive && (
        <button
          onClick={() => navigate(-1)}
          className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-frui-white border border-neutral-200 shadow-md active:scale-95 transition-transform z-20 cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-frui-blue" />
        </button>
      )}

      {/* Main aspect container */}
      <div className={aspectClass}>
        {gallery.desktopLayoutMode === 'one' ? (
          <div
            onClick={() => handleImageClick(0)}
            className="relative w-full h-full overflow-hidden bg-frui-placeholder cursor-pointer"
          >
            <img
              src={gallery.visibleImages[0]}
              alt="Main view"
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </div>
        ) : gallery.desktopLayoutMode === 'three' ? (
          responsive ? (
            <>
              {/* Mobile view (single image) */}
              <div
                onClick={() => handleImageClick(0)}
                className="block md:hidden relative w-full h-full overflow-hidden bg-frui-placeholder cursor-pointer"
              >
                <img
                  src={gallery.visibleImages[0]}
                  alt="Stay view mobile"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
              </div>
              {/* Desktop view (3-image grid) */}
              <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-2 w-full h-full">
                {renderThreeGrid()}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full h-full">
              {renderThreeGrid()}
            </div>
          )
        ) : responsive ? (
          <>
            {/* Mobile view (single image) */}
            <div
              onClick={() => handleImageClick(0)}
              className="block md:hidden relative w-full h-full overflow-hidden bg-frui-placeholder cursor-pointer"
            >
              <img
                src={gallery.visibleImages[0]}
                alt="Stay view mobile"
                className="absolute inset-0 w-full h-full object-cover select-none"
              />
            </div>
            {/* Desktop view (5-image grid) */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 w-full h-full">
              {renderFiveGrid()}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-full">
            {renderFiveGrid()}
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={gallery.isModalOpen}
        onClose={gallery.closeModal}
        images={gallery.images}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}
