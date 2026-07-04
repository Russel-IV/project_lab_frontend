import { useState, useMemo } from 'react';

export type GalleryLayoutMode = 'one' | 'three' | 'five';

export interface UsePhotoGalleryProps {
  images?: string[];
  maxPhotos?: 3 | 5;
}

/**
 * Custom React hook to manage the state and layout calculations for a photo gallery.
 * Determines the layout mode for desktop displays based on the count of images and maxPhotos limit,
 * and maintains the state of the fullscreen photo modal.
 *
 * @param props - Configuration properties for the gallery hook.
 * @param props.images - Optional array of image source strings (URLs).
 * @param props.maxPhotos - Maximum number of photos allowed in the grid layout (3 or 5).
 * @returns An object containing safe images, visible images slice, current desktop layout mode,
 * modal visibility state, and callbacks to open or close the modal.
 */
export function usePhotoGallery({
  images,
  maxPhotos = 5,
}: UsePhotoGalleryProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Return a safe array representation of the images prop
  const safeImages = useMemo(() => {
    return images || [];
  }, [images]);

  // Determine desktop layout based on safe image count and maxPhotos limit
  const desktopLayoutMode = useMemo((): GalleryLayoutMode => {
    const count = safeImages.length;
    if (maxPhotos === 3) {
      if (count >= 3) return 'three';
      return 'one';
    }
    // Default to maxPhotos = 5
    if (count >= 5) return 'five';
    if (count >= 3) return 'three';
    return 'one';
  }, [safeImages, maxPhotos]);

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
