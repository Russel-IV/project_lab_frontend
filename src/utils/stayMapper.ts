import { type StayDto } from '@/dtos/StayDto';
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

const localImages = [iberostarLlautImg, iberostarPlayaImg, hotelDunasImg];

export function mapStayDtoToStay(dto: StayDto): Stay {
  // Select image based on id to keep it deterministic but varied
  const imageIndex = dto.id % localImages.length;
  const image = localImages[imageIndex];

  return {
    id: String(dto.id),
    image: image,
    title: dto.name,
    distance: dto.city ? `Located in ${dto.city}` : 'Playa de Palma',
    hasPool: true,
    vipAccess: true,
    isAd: false,
    highlightTitle: 'Top Rated Stay',
    highlightDesc:
      dto.about ||
      'Excellent hotel near the sea with a magnificent spa and pool.',
    refundPolicy: dto.isRefundable ? 'Fully refundable' : 'Non-refundable',
    reservePolicy: 'Reserve now, pay later',
    rating: dto.starRating !== null ? dto.starRating : 9.0,
    ratingText:
      dto.starRating !== null && dto.starRating >= 9.0
        ? 'Exceptional'
        : 'Wonderful',
    reviewsCount: 150,
    priceNightly: dto.price,
    priceTotal: dto.price * 2,
    priceTotalRooms: 2,
    originalPrice: dto.price * 1.15,
    availabilityAlert: dto.isAvailable ? undefined : 'Sold out',
  };
}
