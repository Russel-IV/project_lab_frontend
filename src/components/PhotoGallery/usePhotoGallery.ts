import { useState, useMemo } from 'react';

export type GalleryLayoutMode = 'one' | 'three' | 'five';

export interface UsePhotoGalleryProps {
  images?: string[];
  maxPhotos?: 3 | 5;
}

export function usePhotoGallery({
  images,
  maxPhotos = 5,
}: UsePhotoGalleryProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeImages = useMemo(() => {
    return images || [];
  }, [images]);

  const desktopLayoutMode = useMemo((): GalleryLayoutMode => {
    const count = safeImages.length;
    if (maxPhotos === 3) {
      if (count >= 3) return 'three';
      return 'one';
    }
    if (count >= 5) return 'five';
    if (count >= 3) return 'three';
    return 'one';
  }, [safeImages, maxPhotos]);

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
