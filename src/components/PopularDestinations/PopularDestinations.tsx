import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePopularDestinations } from '@/hooks/useDestinations';
import galleryMountain from '@/assets/images/gallery-mountain.webp';
import galleryStreet from '@/assets/images/gallery-street.webp';
import galleryKyoto from '@/assets/images/gallery-kyoto.webp';
import gallerySantorini from '@/assets/images/gallery-santorini.webp';
import galleryAurora from '@/assets/images/gallery-aurora.webp';

const CARD_IMAGES = [
  galleryMountain,
  galleryStreet,
  galleryKyoto,
  gallerySantorini,
  galleryAurora,
];

// Distance (px) the pointer must travel before a mousedown is treated as a
// drag rather than a click, so tapping a card still navigates normally.
const DRAG_THRESHOLD = 5;

export default function PopularDestinations() {
  const { destinations, loading } = usePopularDestinations(8);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateFades();
    window.addEventListener('resize', updateFades);
    return () => window.removeEventListener('resize', updateFades);
  }, [destinations, loading]);

  const handleMouseDown = (e: MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) drag.current.moved = true;
    el.scrollLeft = drag.current.startScrollLeft - delta;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  const handleClickCapture = (e: MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!loading && destinations.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 text-left">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121324] mb-3">
        Popular destinations
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onScroll={updateFades}
          onClickCapture={handleClickCapture}
          className="flex items-stretch gap-3 overflow-x-auto scrollbar-none pb-1 cursor-grab select-none active:cursor-grabbing"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 w-40 shrink-0 rounded-xl" />
              ))
            : destinations.map((destination, idx) => (
                <Link
                  key={`${destination.city}-${destination.countryCode}`}
                  to={`/stays?place=${encodeURIComponent(destination.city)}`}
                  draggable={false}
                  className="group relative h-28 w-40 shrink-0 overflow-hidden rounded-xl shadow-sm"
                >
                  <img
                    src={CARD_IMAGES[idx % CARD_IMAGES.length]}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1 text-white">
                    <MapPin className="size-3.5 shrink-0 drop-shadow-sm" />
                    <span className="text-sm font-semibold truncate drop-shadow-sm">
                      {destination.city}, {destination.countryCode}
                    </span>
                  </div>
                </Link>
              ))}
        </div>

        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-frui-white to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-frui-white to-transparent" />
        )}
      </div>
    </section>
  );
}
