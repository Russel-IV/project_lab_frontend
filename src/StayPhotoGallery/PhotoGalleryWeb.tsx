import { LayoutGrid } from 'lucide-react';
import type { GalleryLayoutMode } from './usePhotoGallery';
import { OneImageLayout } from './layouts/OneImageLayout';
import { ThreeImageLayout } from './layouts/ThreeImageLayout';
import { FiveImageLayout } from './layouts/FiveImageLayout';

interface PhotoGalleryWebProps {
  gallery: {
    images: string[];
    visibleImages: string[];
    desktopLayoutMode: GalleryLayoutMode;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  };
}

const LAYOUT_COMPONENTS: Record<
  GalleryLayoutMode,
  React.ComponentType<{ images: string[]; onOpenModal: () => void }>
> = {
  one: OneImageLayout,
  three: ThreeImageLayout,
  five: FiveImageLayout,
};

export function PhotoGalleryWeb({ gallery }: PhotoGalleryWebProps) {
  const Layout = LAYOUT_COMPONENTS[gallery.desktopLayoutMode];

  return (
    <div className="relative w-full aspect-[2/1] rounded-1xl overflow-hidden shadow-sm bg-muted/20">
      {/* Dynamic Grid Layout */}
      <Layout images={gallery.visibleImages} onOpenModal={gallery.openModal} />

      {/* Floating Action Button: "Show all photos" */}
      <button
        onClick={gallery.openModal}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-white hover:bg-neutral-50 active:scale-[0.98] text-neutral-800 text-xs md:text-sm font-semibold py-1.5 px-3 md:py-2 md:px-4 rounded-lg border border-neutral-300/80 shadow-md cursor-pointer transition-all duration-200 z-10"
      >
        <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-800" />
        <span>Show all the pictures</span>
      </button>
    </div>
  );
}
