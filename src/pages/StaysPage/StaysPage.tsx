import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery } from '@/store/searchSlice';
import { SearchForm } from '@/components/SearchForm';
import { FilterBar } from '@/components/FilterBar';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { StayCardSkeleton } from '@/components/StayCardVariant';
import { Seo } from '@/lib/seo';
import { useFavorites } from '@/hooks/useFavorites';
import { useStaysFilter } from '@/hooks/useStaysFilter';

import {
  PAGE_SIZE,
  StaysEmptyState,
  StaysListContent,
} from './StaysListContent';
import { StaysDetailContent } from './StaysDetailContent';

const SCROLL_TOP_THRESHOLD = 400;

export default function StaysPage() {
  const dispatch = useAppDispatch();

  const { place, isSurpriseMe } = useAppSelector((state) => state.search);
  const [searchParams] = useSearchParams();

  // Location filtering is regionId-only (city/countryCode text matching was
  // removed from the schema per ADR-0018, which favors a resolved
  // destination id over free-text matching) - if the user hasn't selected a
  // suggestion yet (no regionId resolved), no location filter is applied,
  // same as when the field is empty. All filtering (search fields and
  // FilterBar fields alike) is applied server-side, so infinite-scroll pages
  // stay correct past the first page.
  const filter = useStaysFilter();

  // Mirrors useSearchContextFilter's URL-vs-redux merge: the URL is the
  // source of truth on page load, redux otherwise.
  const surpriseParam = searchParams.get('surprise');
  const effectiveIsSurpriseMe =
    surpriseParam != null ? surpriseParam === 'true' : isSurpriseMe;

  const canShowResults = filter?.regionId != null || effectiveIsSurpriseMe;

  const { favorites, toggleFavorite } = useFavorites();
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const placeParam = searchParams.get('place');
    const regionIdUrlParam = searchParams.get('regionId');
    const surpriseUrlParam = searchParams.get('surprise');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const travelersParam = searchParams.get('travelers');

    dispatch(
      setSearchQuery({
        place: placeParam ?? undefined,
        placeRegionId: regionIdUrlParam ? Number(regionIdUrlParam) : null,
        isSurpriseMe: surpriseUrlParam === 'true',
        checkIn: checkInParam ?? undefined,
        checkOut: checkOutParam ?? undefined,
        travelers: travelersParam ?? undefined,
      }),
    );
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (selectedStayId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedStayId]);

  const closeDetail = () => setSelectedStayId(null);

  const trimmedPlace = place.trim();

  return (
    <div className="flex-1 bg-frui-white pt-6 pb-10 px-4 sm:px-6 lg:px-8">
      <Seo
        title={
          effectiveIsSurpriseMe
            ? 'Surprise Stays'
            : trimmedPlace
              ? `Stays in ${trimmedPlace}`
              : 'Search Stays'
        }
        description={
          effectiveIsSurpriseMe
            ? 'Browse a surprise pick of stays worldwide. Compare prices, amenities, and reviews on Frui.'
            : trimmedPlace
              ? `Browse and book stays in ${trimmedPlace}. Compare prices, amenities, and reviews on Frui.`
              : 'Browse and book stays worldwide. Compare prices, amenities, and reviews on Frui.'
        }
        path="/stays"
      />

      <main className="w-full">
        <section className="w-full max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col gap-4 pb-2">
            <SearchForm />
            {canShowResults && <FilterBar onSelectStay={setSelectedStayId} />}
          </div>

          {canShowResults ? (
            <ErrorBoundary FallbackComponent={StaysErrorFallback}>
              <Suspense fallback={<StayCardsGridSkeleton />}>
                <StaysListContent
                  filter={filter}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  selectedStayId={selectedStayId}
                  setSelectedStayId={setSelectedStayId}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <StaysEmptyState message="Select a destination first" />
          )}
        </section>
      </main>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed left-4 bottom-6 md:left-8 z-40 flex size-11 items-center justify-center rounded-full bg-frui-orange text-frui-white shadow-lg transition-all hover:bg-[#cf5505] active:scale-95 cursor-pointer border-0"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {selectedStayId !== null && (
        <>
          <div
            className="fixed inset-0 bg-frui-blue/40 z-[55]"
            onClick={closeDetail}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 z-[60] h-full w-full md:w-[56%] lg:w-[47%] xl:w-[50%] p-4 md:p-6">
            <StaysDetailContent
              selectedStayId={selectedStayId}
              onClose={closeDetail}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Matches PAGE_SIZE so the fallback's row count (and thus height) lines up
// with the real virtualized grid — a mismatch here was a major CLS source,
// since swapping to a taller/shorter real grid shoves the footer around.
export function StayCardsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
        <StayCardSkeleton key={idx} />
      ))}
    </div>
  );
}

function StaysErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error || 'An unexpected error occurred.');

  return (
    <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium flex flex-col gap-2">
      <h3 className="font-semibold text-base text-foreground">
        Something went wrong
      </h3>
      <p className="text-muted-foreground">{errorMessage}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 w-fit bg-frui-orange text-frui-white hover:brightness-95 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer border-0"
      >
        Try Again
      </button>
    </div>
  );
}
