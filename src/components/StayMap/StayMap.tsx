import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface StayMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function StayMap({ latitude, longitude, name }: StayMapProps) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const position = { lat: latitude, lng: longitude };

  return (
    <div className="map-container relative h-[300px] w-full overflow-hidden rounded-2xl border border-border">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={position}
          defaultZoom={15}
          mapId="MAP_ID"
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <AdvancedMarker position={position} title={name}>
            <MapPin
              className="size-10 drop-shadow-md"
              color="#121529"
              fill="#ba520a"
              strokeWidth={0.75}
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
