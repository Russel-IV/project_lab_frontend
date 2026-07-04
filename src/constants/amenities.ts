import React from 'react';
import {
  Wifi,
  Wind,
  Waves,
  Utensils,
  Dumbbell,
  Sun,
  Tv,
  Bath,
  Flame,
  Coffee,
} from 'lucide-react';

export type AmenityType = 'PROPERTY_AMENITY' | 'ROOM_AMENITY';

export interface AmenityConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  type: AmenityType;
}

export const AMENITIES_LOOKUP: Record<number, AmenityConfig> = {
  1: { name: 'High-Speed Wi-Fi', icon: Wifi, type: 'PROPERTY_AMENITY' },
  2: { name: 'Air Conditioning', icon: Wind, type: 'ROOM_AMENITY' },
  3: { name: 'Private Pool', icon: Waves, type: 'PROPERTY_AMENITY' },
  4: { name: 'Fully Equipped Kitchen', icon: Utensils, type: 'ROOM_AMENITY' },
  5: { name: 'Washing Machine', icon: Tv, type: 'PROPERTY_AMENITY' }, // fallback icon for laundry
  6: { name: 'Gym Access', icon: Dumbbell, type: 'PROPERTY_AMENITY' },
  7: { name: 'Balcony', icon: Sun, type: 'ROOM_AMENITY' },
  8: { name: 'Hot Tub', icon: Bath, type: 'PROPERTY_AMENITY' },
  9: { name: 'Fireplace', icon: Flame, type: 'ROOM_AMENITY' },
  10: { name: 'Breakfast Bar', icon: Coffee, type: 'PROPERTY_AMENITY' },
};
