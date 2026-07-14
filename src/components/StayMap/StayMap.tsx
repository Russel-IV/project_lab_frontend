import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface MarkerInfo {
  latitude: number;
  longitude: number;
  name: string;
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
        >
          {activeMarkers.map((marker, idx) => (
            <AdvancedMarker
              key={idx}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              title={marker.name}
            >
              <MapPin
                className="size-10 drop-shadow-md"
                color="#121529"
                fill="#e8660d"
                strokeWidth={0.75}
              />
            </AdvancedMarker>
          ))}
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
