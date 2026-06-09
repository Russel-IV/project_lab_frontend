import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter } from '@/components/Filter/Filter';
import { StayCard } from '@/components/StayCard/StayCard';
import { type Stay, mapStayDtoToStay } from '@/utils/stayMapper';
import iberostarLlautImg from '@/assets/iberostar_selection_llaut.png';
import iberostarPlayaImg from '@/assets/iberostar_selection_playa.png';
import hotelDunasImg from '@/assets/hotel_hm_dunas_blancas.png';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStays } from '@/store/staysSlice';

const staysData: Stay[] = [
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

export default function StaysPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.stays);

  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Dispatch the thunk once when the component mounts
  useEffect(() => {
    dispatch(fetchStays());
  }, [dispatch]);

  // Log the state whenever it changes
  useEffect(() => {
    console.log('Stays Redux State:', { data, loading, error });
  }, [data, loading, error]);

  const selection = searchParams.get('selection') || 'None';
  const dates = searchParams.get('dates') || 'None';
  const travelers = searchParams.get('travelers') || 'None';

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayStays = data.length > 0 ? data.map(mapStayDtoToStay) : staysData;

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* Header section showing current query */}
        <div className="flex flex-col gap-2 border-b border-border pb-6">
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline self-start"
          >
            &larr; Back to Search
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
            Available Stays in Palma
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing stays for{' '}
            <span className="font-semibold text-foreground">{selection}</span> •{' '}
            <span className="font-semibold text-foreground">{dates}</span> •{' '}
            <span className="font-semibold text-foreground">{travelers}</span>
          </p>
        </div>

        {/* Main layout container with sidebar on the left and stays list on the right */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Filter />

          {/* Stays List */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {displayStays.map((stay) => {
              const isLiked = !!favorites[stay.id];
              return (
                <StayCard
                  key={stay.id}
                  stay={stay}
                  isLiked={isLiked}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
