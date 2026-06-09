import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter } from '@/components/Filter/Filter';
import { StayCard } from '@/components/StayCard/StayCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStays } from '@/store/staysSlice';

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

  return (
    <div className="flex-1 bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
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
            {data.map((stay) => {
              const isLiked = !!favorites[stay.id];
              return (
                <StayCard key={stay.id} stay={stay}>
                  <StayCard.Left>
                    <StayCard.Image />
                    <StayCard.FavoriteButton
                      isLiked={isLiked}
                      onToggle={toggleFavorite}
                    />
                    <StayCard.Navigation />
                  </StayCard.Left>
                  <StayCard.Right>
                    <StayCard.Header>
                      <StayCard.Distance />
                      <StayCard.Title />
                      <StayCard.Features />
                      <StayCard.Highlight />
                    </StayCard.Header>
                    <StayCard.Footer>
                      <StayCard.LeftFooterSection>
                        <StayCard.RefundPolicies />
                        <StayCard.Rating />
                      </StayCard.LeftFooterSection>
                      <StayCard.RightFooterSection>
                        <StayCard.Pricing />
                      </StayCard.RightFooterSection>
                    </StayCard.Footer>
                  </StayCard.Right>
                </StayCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
