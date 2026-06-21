import { useState, useMemo } from 'react';

// Import local image assets for fallback
import beachExterior from '@/assets/images/beach-exterior.png';
import lobby from '@/assets/images/lobby.png';
import standardKing from '@/assets/images/standard-king.png';
import cabinExterior from '@/assets/images/cabin-exterior.png';
import livingRoom from '@/assets/images/living-room.png';

const MOCK_IMAGES = [
  beachExterior,
  lobby,
  standardKing,
  cabinExterior,
  livingRoom,
];

export type GalleryLayoutMode = 'one' | 'three' | 'five';

export interface UsePhotoGalleryProps {
  images?: string[];
}

/**
 * Custom React hook to manage the state and layout calculations for a stay's photo gallery.
 * Handles fallback to local mock images, determines the layout mode for desktop displays,
 * and maintains the state of the fullscreen photo modal.
 *
 * @param props - Configuration properties for the gallery hook.
 * @param props.images - Optional array of image source strings (URLs or imported assets).
 * @returns An object containing safe images, visible images slice, current desktop layout mode,
 * modal visibility state, and callbacks to open or close the modal.
 */
export function usePhotoGallery({ images }: UsePhotoGalleryProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fallback to local mock assets if no images are provided or the list is empty
  const safeImages = useMemo(() => {
    return images && images.length > 0 ? images : MOCK_IMAGES;
  }, [images]);

  // Determine desktop layout based on safe image count
  const desktopLayoutMode = useMemo((): GalleryLayoutMode => {
    const count = safeImages.length;
    if (count >= 5) return 'five';
    if (count >= 3) return 'three';
    return 'one';
  }, [safeImages]);

  // Slice images to only pass relevant ones to grid layouts
  const visibleImages = useMemo(() => {
    if (desktopLayoutMode === 'five') return safeImages.slice(0, 5);
    if (desktopLayoutMode === 'three') return safeImages.slice(0, 3);
    return safeImages.slice(0, 1);
  }, [safeImages, desktopLayoutMode]);

  return {
    images: safeImages,
    visibleImages,
    desktopLayoutMode,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
  };
}
