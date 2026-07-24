import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
  startTransition,
} from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type {
  GetStaysQuery,
  GetStaysQueryVariables,
  StayFilterInput,
} from '@/types/__generated__/graphql';
import { GET_STAYS } from '@/graphql/stays';
import { StayCardVariant } from '@/components/StayCardVariant';
import { useReviewSummaries } from '@/hooks/useReviewSummaries';
import { JsonLd } from '@/lib/seo';
import { SITE_URL } from '@/config/seo';
import { useAppSelector } from '@/store/hooks';

export function StaysEmptyState({ message }: { message: string }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-2xl bg-card">
      <p className="text-lg font-semibold text-foreground">{message}</p>
    </div>
  );
}

type GraphQLStay = GetStaysQuery['stays']['items'][number];

export const PAGE_SIZE = 12;
// Real pixel distance from the true scroll bottom (not the overscan buffer)
// that triggers the next fetch — roughly one row's height ahead.
const LOAD_MORE_DISTANCE_PX = 600;

function getColumnsForWidth(width: number) {
  if (width >= 1024) return 3; // lg:grid-cols-3
  if (width >= 640) return 2; // sm:grid-cols-2
  return 1; // grid-cols-1
}

function useResponsiveColumns() {
  const [columns, setColumns] = useState(() =>
    getColumnsForWidth(typeof window === 'undefined' ? 0 : window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setColumns(getColumnsForWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return columns;
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

interface StaysContentProps {
  filter: StayFilterInput | undefined;
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
  selectedStayId: number | null;
  setSelectedStayId: (id: number | null) => void;
}

export function StaysListContent({
  filter,
  favorites,
  toggleFavorite,
  selectedStayId,
  setSelectedStayId,
}: StaysContentProps) {
  const { data, fetchMore } = useSuspenseQuery<
    GetStaysQuery,
    GetStaysQueryVariables
  >(GET_STAYS, { variables: { filter, page: 0, size: PAGE_SIZE } });

  const {
    priceMin,
    priceMax,
    propertyType,
    freeCancellation,
    starRatings,
    bedrooms,
    propertyAmenityIds,
    roomAmenityIds,
  } = useAppSelector((state) => state.filters);

  const hasActiveFilters =
    priceMin !== null ||
    priceMax !== null ||
    propertyType !== null ||
    freeCancellation ||
    starRatings.length > 0 ||
    bedrooms.length > 0 ||
    propertyAmenityIds.length > 0 ||
    roomAmenityIds.length > 0;

  const stays: GraphQLStay[] = data.stays.items;
  const hasNextPage = data.stays.hasNextPage;

  const columns = useResponsiveColumns();
  const rows = useMemo(() => chunk(stays, columns), [stays, columns]);

  const parentRef = useRef<HTMLDivElement>(null);
  const [parentOffset, setParentOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      setParentOffset(parentRef.current?.offsetTop ?? 0);
      setContainerWidth(parentRef.current?.clientWidth ?? 0);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Cards are aspect-[4/3], so the row height is derivable from the measured
  // container width instead of guessed — an inaccurate estimate here is what
  // was causing a large CLS hit (the whole page, footer included, jumping
  // once measureElement corrected every row after mount).
  const estimatedRowHeight = useMemo(() => {
    if (containerWidth === 0) return 320;
    const gap = 16;
    const cardWidth = (containerWidth - gap * (columns - 1)) / columns;
    return cardWidth * (3 / 4);
  }, [containerWidth, columns]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => estimatedRowHeight,
    overscan: 3,
    gap: 16,
    scrollMargin: parentOffset,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const isFetchingMoreRef = useRef(false);
  // scrollOffset (not the overscan-rendered range) is the correct signal for
  // "is the user actually near the bottom" — overscan alone can span the
  // entire list when there are only a few rows, which would otherwise fire
  // fetchMore for every page back-to-back regardless of scroll position.
  const scrollOffset = rowVirtualizer.scrollOffset ?? 0;

  useEffect(() => {
    if (!hasNextPage || isFetchingMoreRef.current) return;
    if (!rowVirtualizer.isAtEnd(LOAD_MORE_DISTANCE_PX)) return;

    isFetchingMoreRef.current = true;
    const nextPage = Math.floor(stays.length / PAGE_SIZE);
    startTransition(() => {
      fetchMore({ variables: { page: nextPage } }).finally(() => {
        isFetchingMoreRef.current = false;
      });
    });
  }, [scrollOffset, hasNextPage, stays.length, fetchMore, rowVirtualizer]);

  // Bounded to whatever rows are actually mounted, so this batch query stays
  // small no matter how many pages the user has scrolled through.
  const visibleStayIds = virtualRows.flatMap(
    (vr) => rows[vr.index]?.map((s) => s.id) ?? [],
  );
  const { summaries: reviewSummaries, loading: reviewSummariesLoading } =
    useReviewSummaries(visibleStayIds);

  const activeStayId = useMemo(() => {
    if (selectedStayId !== null && stays.some((s) => s.id === selectedStayId)) {
      return selectedStayId;
    }
    return null;
  }, [stays, selectedStayId]);

  // If the selected stay drops out of the result set (e.g. a filter change),
  // close the detail drawer instead of silently swapping to a different stay.
  useEffect(() => {
    if (selectedStayId !== null && activeStayId === null) {
      setSelectedStayId(null);
    }
  }, [activeStayId, selectedStayId, setSelectedStayId]);

  const noStays = stays.length === 0;

  // ItemList structured data so search engines can surface the currently
  // loaded stays (and link straight to their detail pages) in rich results.
  const itemListJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: stays.map((stay, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/stay/${stay.id}`,
        name: stay.name,
      })),
    }),
    [stays],
  );

  return (
    <>
      <div className="sm:hidden mt-4">
        <h1 className="text-2xl font-bold">Showing Stays in La Palma</h1>
        <p className="text-sm text-gray-600">
          Showing stays from: Jun 4 - Jun 5...
        </p>
      </div>

      {noStays ? (
        <StaysEmptyState
          message={
            hasActiveFilters
              ? 'No stays match your filters. Try removing some filters to see more results.'
              : 'There are no stays that fit your needs available currently. Try searching again with different requirements.'
          }
        />
      ) : (
        <>
          <JsonLd data={itemListJsonLd} />
          <div ref={parentRef} className="relative w-full mt-4">
            <div
              style={{
                position: 'relative',
                height: rowVirtualizer.getTotalSize(),
                width: '100%',
              }}
            >
              {virtualRows.map((virtualRow) => {
                const rowStays = rows[virtualRow.index];
                if (!rowStays) return null;
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      // virtualRow.start is document-relative (it bakes in
                      // scrollMargin, the grid's offset from the page top) —
                      // subtract it back out since this row is positioned
                      // inside the grid's own container, not the page.
                      transform: `translateY(${virtualRow.start - parentOffset}px)`,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: '1rem',
                      }}
                    >
                      {rowStays.map((stay, colIndex) => (
                        <StayCardVariant
                          key={stay.id}
                          stay={stay}
                          isLiked={!!favorites[stay.id]}
                          onToggleFavorite={toggleFavorite}
                          isActive={activeStayId === stay.id}
                          onClick={() => setSelectedStayId(stay.id)}
                          reviewSummary={reviewSummaries.get(stay.id)}
                          reviewSummaryLoading={reviewSummariesLoading}
                          priority={virtualRow.index === 0 && colIndex < 3}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
