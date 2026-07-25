import { lazy, Suspense, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_STAYS } from '@/graphql/stays';
import { useStaysFilter } from '@/hooks/useStaysFilter';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  GetStaysQuery,
  GetStaysQueryVariables,
} from '@/types/__generated__/graphql';

const StayMap = lazy(() =>
  import('@/components/StayMap/StayMap').then((m) => ({ default: m.StayMap })),
);

interface StaysMapModalProps {
  onClose: () => void;
}

export function StaysMapModal({ onClose }: StaysMapModalProps) {
  const filter = useStaysFilter();

  // size: 100 pulls every currently-filtered stay in one shot for the pins —
  // deliberately separate from the list's paginated GET_STAYS call, which
  // only ever holds however many pages have been scrolled into.
  const { data, loading } = useQuery<GetStaysQuery, GetStaysQueryVariables>(
    GET_STAYS,
    { variables: { filter, page: 0, size: 100 } },
  );

  const markers = useMemo(() => {
    const items = data?.stays.items ?? [];
    return items
      .filter(
        (s): s is typeof s & { location: NonNullable<typeof s.location> } =>
          s.location !== null,
      )
      .map((s) => ({
        name: s.name,
        latitude: s.location.latitude,
        longitude: s.location.longitude,
      }));
  }, [data]);

  // No single stay to center on at the list level, so center on the
  // average position of every pin instead.
  const center = useMemo(() => {
    if (markers.length === 0) return null;
    return {
      latitude:
        markers.reduce((sum, m) => sum + m.latitude, 0) / markers.length,
      longitude:
        markers.reduce((sum, m) => sum + m.longitude, 0) / markers.length,
    };
  }, [markers]);

  return (
    <div
      className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Nearby Properties
            </h2>
            <p className="text-xs text-neutral-500">
              Showing all available listings on the map
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 font-medium text-lg w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center border-0 cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 w-full h-full relative">
          {center ? (
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <StayMap
                latitude={center.latitude}
                longitude={center.longitude}
                name="Stays"
                markers={markers}
                className="w-full h-full"
                gestureHandling="greedy"
                disableDefaultUI={false}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
              {loading
                ? 'Loading map…'
                : 'None of the current stays have a location to show.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
