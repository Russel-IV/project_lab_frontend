import { usePhotoGallery } from './usePhotoGallery';
import { PhotoGalleryWeb } from './PhotoGalleryWeb';
import { PhotoGalleryMobile } from './PhotoGalleryMobile';

interface StayPhotoGalleryProps {
  images?: string[];
}

export default function StayPhotoGallery({ images }: StayPhotoGalleryProps) {
  const gallery = usePhotoGallery({ images });

  if (gallery.images.length === 0) {
    return (
      <div className="w-full aspect-[2/1] rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  return (
    <div className="w-full relative select-none">
      {/* Mobile viewport view (< md) */}
      <div className="block md:hidden">
        <PhotoGalleryMobile gallery={gallery} />
      </div>

      {/* Desktop viewport view (>= md) */}
      <div className="hidden md:block">
        <PhotoGalleryWeb gallery={gallery} />
      </div>
    </div>
  );
}
