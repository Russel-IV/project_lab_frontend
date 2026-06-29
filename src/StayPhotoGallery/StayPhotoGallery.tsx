import { usePhotoGallery } from './usePhotoGallery';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface StayPhotoGalleryProps {
  images?: string[];
}

export default function StayPhotoGallery({ images }: StayPhotoGalleryProps) {
  const gallery = usePhotoGallery({ images });
  const navigate = useNavigate();

  if (gallery.images.length === 0) {
    return (
      <div className="w-auto aspect-[4/3] md:aspect-[2/1] rounded-2xl bg-frui-placeholder animate-pulse -mx-4 sm:-mx-6 md:mx-0" />
    );
  }

  return (
    <div className="w-auto relative select-none -mx-4 sm:-mx-6 md:mx-0">
      {/* Mobile Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-frui-white border border-neutral-200 shadow-md active:scale-95 transition-transform z-20 cursor-pointer flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 text-frui-blue" />
      </button>

      <div className="w-full aspect-[4/3] md:aspect-[2/1] md:rounded-2xl overflow-hidden shadow-sm bg-frui-placeholder">
        {gallery.desktopLayoutMode === 'one' ? (
          <img
            src={gallery.visibleImages[0]}
            alt="Stay view"
            className="w-full h-full object-cover select-none animate-fade-in"
          />
        ) : gallery.desktopLayoutMode === 'three' ? (
          <>
            {/* Mobile view (single image) */}
            <div className="block md:hidden w-full h-full">
              <img
                src={gallery.visibleImages[0]}
                alt="Stay view mobile"
                className="w-full h-full object-cover select-none"
              />
            </div>
            {/* Desktop view (3-image grid) */}
            <div className="hidden md:grid grid-cols-3 gap-2 w-full h-full">
              <div className="col-span-2 relative overflow-hidden bg-frui-placeholder">
                <img
                  src={gallery.visibleImages[0]}
                  alt="Main stay view"
                  className="absolute inset-0 w-full h-full object-cover select-none hover:brightness-90 transition-all duration-300"
                />
              </div>
              <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                {gallery.visibleImages.slice(1, 3).map((img, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden bg-frui-placeholder"
                  >
                    <img
                      src={img}
                      alt={`Stay view ${index + 2}`}
                      className="absolute inset-0 w-full h-full object-cover select-none hover:brightness-90 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile view (single image) */}
            <div className="block md:hidden w-full h-full">
              <img
                src={gallery.visibleImages[0]}
                alt="Stay view mobile"
                className="w-full h-full object-cover select-none"
              />
            </div>
            {/* Desktop view (5-image grid) */}
            <div className="hidden md:grid grid-cols-4 gap-2 w-full h-full">
              <div className="col-span-2 row-span-2 relative overflow-hidden bg-frui-placeholder">
                <img
                  src={gallery.visibleImages[0]}
                  alt="Main stay view"
                  className="absolute inset-0 w-full h-full object-cover select-none hover:brightness-90 transition-all duration-300"
                />
              </div>
              {gallery.visibleImages.slice(1, 5).map((img, index) => (
                <div
                  key={index}
                  className="col-span-1 relative overflow-hidden bg-frui-placeholder"
                >
                  <img
                    src={img}
                    alt={`Detail view ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover select-none hover:brightness-90 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
