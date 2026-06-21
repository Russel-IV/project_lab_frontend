import { ChevronLeft, Share2, Heart } from 'lucide-react';
import type { GalleryLayoutMode } from './usePhotoGallery';

interface PhotoGalleryMobileProps {
  gallery: {
    images: string[];
    visibleImages: string[];
    desktopLayoutMode: GalleryLayoutMode;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  };
}

export function PhotoGalleryMobile({ gallery }: PhotoGalleryMobileProps) {
  const mainImage = gallery.images[0];

  return (
    <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
      {/* Mobile main image */}
      <img
        src={mainImage}
        alt="Stay preview mobile"
        className="w-full h-full object-cover cursor-pointer"
        onClick={gallery.openModal}
      />

      {/* Premium Floating Overlay Actions */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Back Button */}
        <button className="p-2 rounded-full bg-white shadow-md active:scale-95 transition-transform cursor-pointer pointer-events-auto border border-neutral-200">
          <ChevronLeft className="w-5 h-5 text-neutral-800" />
        </button>

        {/* Share & Like Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="p-2 rounded-full bg-white shadow-md active:scale-95 transition-transform cursor-pointer border border-neutral-200">
            <Share2 className="w-4 h-4 text-neutral-800" />
          </button>
          <button className="p-2 rounded-full bg-white shadow-md active:scale-95 transition-transform cursor-pointer border border-neutral-200">
            <Heart className="w-4 h-4 text-neutral-800" />
          </button>
        </div>
      </div>

      {/* Pagination Dot Overlay (e.g. "1 / 5") */}
      {gallery.images.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-md text-white text-xs font-medium">
          1 / {gallery.images.length}
        </div>
      )}
    </div>
  );
}
