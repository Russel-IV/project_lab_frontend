import iberostarLlautImg from '@/assets/iberostar_selection_llaut.png';
import iberostarPlayaImg from '@/assets/iberostar_selection_playa.png';
import hotelDunasImg from '@/assets/hotel_hm_dunas_blancas.png';

export interface Stay {
  id: string;
  image: string;
  title: string;
  distance: string;
  hasPool: boolean;
  vipAccess: boolean;
  isAd: boolean;
  highlightTitle?: string;
  highlightDesc?: string;
  refundPolicy: string;
  reservePolicy?: string;
  rating: number;
  ratingText: string;
  reviewsCount: number;
  priceNightly: number;
  priceTotal: number;
  priceTotalRooms: number;
  originalPrice?: number;
  availabilityAlert?: string;
}

export const staysData: Stay[] = [
  {
    id: '1',
    image: iberostarLlautImg,
    title: 'Iberostar Selection Llaut Palma - Adults Only',
    distance: '1 mi from Playa de Palma',
    hasPool: true,
    vipAccess: true,
    isAd: true,
    highlightTitle: 'Ideally located in Playa de Palma',
    highlightDesc:
      'Excellent 5*star hotel near the sea. Rooftop with specialty restaurant, pool and chill out. A magnificent Spa.',
    refundPolicy: 'Fully refundable',
    rating: 9.2,
    ratingText: 'Wonderful',
    reviewsCount: 784,
    priceNightly: 447982,
    originalPrice: 4317240,
    priceTotal: 4147844,
    priceTotalRooms: 2,
    availabilityAlert: 'We have 2 left at this price',
  },
  {
    id: '2',
    image: iberostarPlayaImg,
    title: 'Iberostar Selection Playa de Palma',
    distance: '0.1 mi from Playa de Palma',
    hasPool: true,
    vipAccess: true,
    isAd: false,
    refundPolicy: 'Fully refundable',
    reservePolicy: 'Reserve now, pay later',
    rating: 9.4,
    ratingText: 'Exceptional',
    reviewsCount: 780,
    priceNightly: 590747,
    priceTotal: 5540914,
    priceTotalRooms: 2,
    availabilityAlert: 'We have 4 left at this price',
  },
  {
    id: '3',
    image: hotelDunasImg,
    title: 'Hotel HM Dunas Blancas',
    distance: '1.2 mi from Playa de Palma',
    hasPool: true,
    vipAccess: false,
    isAd: false,
    refundPolicy: 'Fully refundable',
    reservePolicy: 'Reserve now, pay later',
    rating: 8.0,
    ratingText: 'Very Good',
    reviewsCount: 169,
    priceNightly: 340125,
    priceTotal: 2306626,
    priceTotalRooms: 2,
  },
];
