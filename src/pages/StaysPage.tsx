import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StayCardVariant } from '@/components/StayCardVariant';
import { type StayDto } from '@/dtos/stayDTO';
import { ItemInfo } from '@/components/ItemInfo';

const mockStays: StayDto[] = [
  {
    id: 9999,
    name: 'Luxury Beachfront Villa',
    about: 'A beautiful villa on the Malibu coast.',
    propertyType: 'HOME',
    address: {
      id: 9999,
      streetAddress: '27352 Pacific Coast Hwy',
      extendedAddress: null,
      city: 'Malibu',
      stateProvince: 'California',
      postalCode: '90265',
      countryCode: 'US',
    },
    isRefundable: true,
    starRating: 4.9,
    daysFromBookingCancellationDeadline: 5,
    policiesText: 'No pets allowed.',
    importantInformation: 'Check-in at 3pm.',
    hostId: 1,
    propertyBrandId: null,
    viewIds: [1],
    amenityIds: [1, 2, 3],
    accessibilityIds: [],
    mealPlanIds: [],
    paymentTypeIds: [1],
    travelerExperienceIds: [],
    rooms: [
      {
        id: 9999,
        stayId: 9999,
        name: 'Master Suite',
        price: 250,
        sleeps: 4,
        bedroomAmount: 2,
        bathrooms: 2.5,
        size: 120.0,
      },
    ],
    pictures: [
      {
        id: 9999,
        stayId: 9999,
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        caption: 'Front of villa',
        isPrimary: true,
        displayOrder: 0,
      },
    ],
    startingFromPrice: 250,
  },
  {
    id: 9998,
    name: 'Minimalist Beach Loft',
    about: 'Cozy beachfront loft with gorgeous sunset views.',
    propertyType: 'HOME',
    address: {
      id: 9998,
      streetAddress: '15 Ocean Front Walk',
      extendedAddress: null,
      city: 'Venice Beach',
      stateProvince: 'California',
      postalCode: '90291',
      countryCode: 'US',
    },
    isRefundable: true,
    starRating: 4.8,
    daysFromBookingCancellationDeadline: 3,
    policiesText: 'Quiet hours after 10 PM.',
    importantInformation: 'Keyless entry instructions sent via email.',
    hostId: 2,
    propertyBrandId: null,
    viewIds: [1],
    amenityIds: [1, 2],
    accessibilityIds: [],
    mealPlanIds: [],
    paymentTypeIds: [1],
    travelerExperienceIds: [],
    rooms: [
      {
        id: 9998,
        stayId: 9998,
        name: 'Loft Suite',
        price: 320,
        sleeps: 2,
        bedroomAmount: 1,
        bathrooms: 1.0,
        size: 80.0,
      },
    ],
    pictures: [
      {
        id: 9998,
        stayId: 9998,
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Interior of loft',
        isPrimary: true,
        displayOrder: 0,
      },
    ],
    startingFromPrice: 320,
  },
  {
    id: 9997,
    name: 'Modern Downtown Condo',
    about: 'Sleek luxury condo in the heart of downtown.',
    propertyType: 'CONDO',
    address: {
      id: 9997,
      streetAddress: '800 Grand Ave',
      extendedAddress: null,
      city: 'DTLA',
      stateProvince: 'California',
      postalCode: '90017',
      countryCode: 'US',
    },
    isRefundable: false,
    starRating: 4.7,
    daysFromBookingCancellationDeadline: 0,
    policiesText: 'No parties or events allowed.',
    importantInformation: 'Valet parking available for a fee.',
    hostId: 3,
    propertyBrandId: null,
    viewIds: [2],
    amenityIds: [2, 3],
    accessibilityIds: [],
    mealPlanIds: [],
    paymentTypeIds: [1],
    travelerExperienceIds: [],
    rooms: [
      {
        id: 9997,
        stayId: 9997,
        name: 'Deluxe Room',
        price: 210,
        sleeps: 2,
        bedroomAmount: 1,
        bathrooms: 1.0,
        size: 70.0,
      },
    ],
    pictures: [
      {
        id: 9997,
        stayId: 9997,
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        caption: 'Living room',
        isPrimary: true,
        displayOrder: 0,
      },
    ],
    startingFromPrice: 210,
  },
  {
    id: 9996,
    name: 'Luxury Coastal Villa',
    about: 'Opulent estate with infinity pool and panoramic ocean views.',
    propertyType: 'HOME',
    address: {
      id: 9996,
      streetAddress: '31200 Broad Beach Rd',
      extendedAddress: null,
      city: 'Malibu',
      stateProvince: 'California',
      postalCode: '90265',
      countryCode: 'US',
    },
    isRefundable: true,
    starRating: 5.0,
    daysFromBookingCancellationDeadline: 7,
    policiesText: 'No smoking. Pets welcome upon approval.',
    importantInformation: 'Check-in at 4pm. Concierge service included.',
    hostId: 4,
    propertyBrandId: null,
    viewIds: [1, 2, 3],
    amenityIds: [1, 2, 3, 4, 5],
    accessibilityIds: [],
    mealPlanIds: [],
    paymentTypeIds: [1, 2],
    travelerExperienceIds: [],
    rooms: [
      {
        id: 9996,
        stayId: 9996,
        name: 'Ocean Suite',
        price: 850,
        sleeps: 6,
        bedroomAmount: 3,
        bathrooms: 3.5,
        size: 250.0,
      },
    ],
    pictures: [
      {
        id: 9996,
        stayId: 9996,
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        caption: 'Exterior showing pool',
        isPrimary: true,
        displayOrder: 0,
      },
    ],
    startingFromPrice: 850,
  },
];
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStays } from '@/store/staysSlice';
import { setSearchQuery } from '@/store/searchSlice';
import SearchForm from '@/components/Form/SearchForm';
import {
  parseISOToDateRange,
  formatDatesRange,
} from '@/components/Form/searchFormUtils';

export default function StaysPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.stays);

  // Read search parameters from the Redux store
  const { place, checkIn, checkOut, travelers } = useAppSelector(
    (state) => state.search,
  );

  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Sync URL query params into Redux store on param change
  useEffect(() => {
    const placeParam = searchParams.get('place');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const travelersParam = searchParams.get('travelers');

    dispatch(
      setSearchQuery({
        place: placeParam ?? undefined,
        checkIn: checkInParam ?? undefined,
        checkOut: checkOutParam ?? undefined,
        travelers: travelersParam ?? undefined,
      }),
    );
  }, [searchParams, dispatch]);

  // Dispatch the thunk whenever the search parameters change
  useEffect(() => {
    dispatch(fetchStays());
  }, [dispatch, place, checkIn, checkOut, travelers]);

  // Log the state whenever it changes
  useEffect(() => {
    console.log('Stays Redux State:', { data, loading, error });
  }, [data, loading, error]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Format dates for display in stays page subheader
  const formattedDates = useMemo(() => {
    return formatDatesRange(parseISOToDateRange(checkIn, checkOut));
  }, [checkIn, checkOut]);

  // Track the selected stay ID
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);

  // Compute stays to show (from api, falling back to mockStays on error/initial load)
  const staysList = useMemo(() => {
    if (loading) return [];
    if (data && data.length > 0) return data;
    if (error || data.length === 0) {
      if (error) return mockStays;
      return []; // No results found
    }
    return mockStays;
  }, [data, loading, error]);

  // Derive the active selected stay ID. Default to the first stay in staysList if selectedStayId isn't set or exists in staysList.
  const activeStayId = useMemo(() => {
    if (
      selectedStayId !== null &&
      staysList.some((s) => s.id === selectedStayId)
    ) {
      return selectedStayId;
    }
    return staysList.length > 0 ? staysList[0].id : null;
  }, [staysList, selectedStayId]);

  const selectedStay = useMemo(() => {
    return staysList.find((s) => s.id === activeStayId) || null;
  }, [staysList, activeStayId]);

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-6">
        <div className="mx-auto max-w-5xl w-full flex flex-col gap-2 border-b border-border pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
            Available Stays in Palma
          </h1>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Showing stays for{' '}
            <span className="font-semibold text-foreground">{place}</span> •{' '}
            <span className="font-semibold text-foreground">
              {formattedDates}
            </span>{' '}
            • <span className="font-semibold text-foreground">{travelers}</span>
          </p>
          <SearchForm>
            <SearchForm.Grid>
              <SearchForm.PlaceField />
              <SearchForm.DatesField />
              <SearchForm.TravelersField />
              <SearchForm.Submit />
            </SearchForm.Grid>
          </SearchForm>
        </div>

        {/* Main layout container with sidebar on the left and stays list on the right */}
        <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden gap-6">
          {/* Left Panel: Stays List (Green Area) */}
          <section className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
            {/* 1. Search Form and Header Area for Mobile */}
            <div className="hidden sm:block bg-gray-200 p-4 rounded-2xl">
              <h1> Search Filter Details</h1>
            </div>

            <div className="sm:hidden">
              {/* Desktop Search Form Component */}
              <form className="mb-4">...</form>
              {/* Header Title */}
              <h1 className="text-2xl font-bold">Showing Stays in La Palma</h1>
              <p className="text-sm text-gray-600">
                Showing stays from: Jun 4 - Jun 5...
              </p>
            </div>

            {/* 2. Cards Grid Container */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-lg font-medium animate-pulse">
                  Loading available stays...
                </p>
              </div>
            ) : staysList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-2xl bg-card">
                <p className="text-lg font-semibold text-foreground">
                  No stays match your search
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters or destination keywords.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {staysList.map((stay) => (
                  <StayCardVariant
                    key={stay.id}
                    stay={stay}
                    isLiked={!!favorites[stay.id]}
                    onToggleFavorite={toggleFavorite}
                    isActive={activeStayId === stay.id}
                    onClick={() => setSelectedStayId(stay.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Right Panel: Map/Details (Red Area) */}
          <aside className="hidden md:block md:w-[56%] lg:w-[47%] xl:w-[50%]  h-full">
            <ItemInfo stay={selectedStay} />
          </aside>
        </main>
      </div>
    </div>
  );
}
