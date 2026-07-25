import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { buildSrcSet } from '@/lib/images';

export interface GalleryPicture {
  url: string;
  thumbnailUrl?: string | null;
  url1024?: string | null;
  url768?: string | null;
  url512?: string | null;
}

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryPicture[];
  initialIndex?: number;
}

export function ImageGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handlePrev, handleNext, onClose]);

  useEffect(() => {
    if (isOpen && thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex, isOpen]);

  if (!isOpen || images.length === 0) return null;

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'IMG' && !target.closest('button')) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-frui-blue/95 text-frui-white select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex items-center justify-between px-6 py-4 h-16 w-full bg-gradient-to-b from-black/50 to-transparent"
      >
        {/* Left side empty placeholder to balance right side spacing */}
        <div className="w-16" />

        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide text-frui-white/90">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 text-frui-white hover:text-frui-orange cursor-pointer focus:outline-none z-10"
          aria-label="Close modal"
        >
          <span className="hidden sm:inline text-sm font-medium">Close</span>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between px-4 sm:px-8 relative max-h-[calc(100vh-10rem)]">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-black/40 text-frui-white border border-frui-white/20 hover:border-frui-orange cursor-pointer focus:outline-none z-10 shrink-0"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 h-full flex items-center justify-center p-2 sm:p-4">
          <img
            {...buildSrcSet(images[currentIndex])}
            sizes="(min-width: 640px) 80vw, 100vw"
            alt={`Expanded view ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-black/40 text-frui-white border border-frui-white/20 hover:border-frui-orange cursor-pointer focus:outline-none z-10 shrink-0"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-t from-black/60 to-transparent pt-4 pb-6"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 scroll-smooth custom-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                onClick={() => handleThumbnailClick(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors duration-200 cursor-pointer focus:outline-none ${
                  idx === currentIndex
                    ? 'border-frui-orange ring-1 ring-frui-orange'
                    : 'border-transparent hover:border-frui-white/50'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={img.thumbnailUrl ?? img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
