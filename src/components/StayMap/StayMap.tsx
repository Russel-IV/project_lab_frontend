import { useState } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MarkerInfo {
  id?: string;
  latitude: number;
  longitude: number;
  name: string;
  thumbnailUrl?: string | null;
  priceLabel?: string;
}

interface StayMapProps {
  latitude: number;
  longitude: number;
  name: string;
  markers?: MarkerInfo[];
  className?: string;
  gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
  disableDefaultUI?: boolean;
}

export function StayMap({
  latitude,
  longitude,
  name,
  markers,
  className = 'h-[300px] w-full rounded-2xl border border-border',
  gestureHandling = 'none',
  disableDefaultUI = true,
}: StayMapProps) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const position = { lat: latitude, lng: longitude };
  const isMobile = useIsMobile();

  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  const activeMarkers = markers || [{ latitude, longitude, name }];

  return (
    <div className={`map-container relative overflow-hidden ${className}`}>
      <APIProvider apiKey={API_KEY}>
        <GoogleMap
          defaultCenter={position}
          defaultZoom={markers ? 12 : 15}
          mapId="MAP_ID"
          gestureHandling={gestureHandling}
          disableDefaultUI={disableDefaultUI}
          onClick={() => setHoveredMarkerId(null)}
        >
          {activeMarkers.map((marker, idx) => {
            const isHoverable = !!(
              marker.id &&
              marker.thumbnailUrl &&
              marker.priceLabel
            );
            const isHovered = isHoverable && hoveredMarkerId === marker.id;
            const hoverHandlers = !isHoverable
              ? {}
              : isMobile
                ? {
                    onClick: () =>
                      setHoveredMarkerId((prev) =>
                        prev === marker.id ? null : (marker.id ?? null),
                      ),
                  }
                : {
                    onMouseEnter: () => setHoveredMarkerId(marker.id ?? null),
                    onMouseLeave: () => setHoveredMarkerId(null),
                  };

            return (
              <AdvancedMarker
                key={marker.id ?? idx}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                title={marker.name}
                zIndex={isHovered ? 1000 : undefined}
                {...hoverHandlers}
              >
                <div className="relative">
                  <MapPin
                    className="size-10 drop-shadow-md"
                    color="#121529"
                    fill="#e8660d"
                    strokeWidth={0.75}
                  />
                  {isHovered && (
                    // Clipped by the map container's overflow-hidden if the
                    // pin sits at the very top of the current view — a known
                    // v1 tradeoff, panning/zooming works around it.
                    <div className="absolute bottom-full left-1/2 mb-1 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                      <img
                        src={marker.thumbnailUrl ?? undefined}
                        alt=""
                        className="size-8 shrink-0 rounded-md object-cover"
                      />
                      <div className="flex flex-col gap-0 pr-1 text-left leading-tight">
                        <span className="max-w-[120px] truncate text-xs font-medium text-neutral-900">
                          {marker.name}
                        </span>
                        <span className="text-xs font-semibold text-frui-orange">
                          {marker.priceLabel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </AdvancedMarker>
            );
          })}
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
