import React from 'react';
import { Wifi, Wind, Waves, Utensils, Dumbbell, Sun, Tv } from 'lucide-react';

export interface AmenityConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AMENITIES_LOOKUP: Record<number, AmenityConfig> = {
  1: { name: 'High-Speed Wi-Fi', icon: Wifi },
  2: { name: 'Air Conditioning', icon: Wind },
  3: { name: 'Private Pool', icon: Waves },
  4: { name: 'Fully Equipped Kitchen', icon: Utensils },
  5: { name: 'Washing Machine', icon: Tv }, // fallback icon for laundry
  6: { name: 'Gym Access', icon: Dumbbell },
  7: { name: 'Balcony', icon: Sun },
};
