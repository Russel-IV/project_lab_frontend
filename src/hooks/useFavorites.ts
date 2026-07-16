import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ApolloCache } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAppSelector } from '@/store/hooks';
import {
  MY_FAVORITE_STAY_IDS,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  type MyFavoriteStayIdsQuery,
  type AddFavoriteMutation,
  type AddFavoriteMutationVariables,
  type RemoveFavoriteMutation,
  type RemoveFavoriteMutationVariables,
} from '@/graphql/favorites';

// Persists favorites server-side (per signed-in user) instead of
// component-local state that reset on every page refresh. Stay ids are kept
// as a Set internally but exposed as a Record<string, boolean> so existing
// card components - which key favorites by the string form of Stay.id -
// don't need to change.
export function useFavorites() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const { data } = useQuery<MyFavoriteStayIdsQuery>(MY_FAVORITE_STAY_IDS, {
    skip: !user,
  });

  const [addFavoriteMutation] = useMutation<
    AddFavoriteMutation,
    AddFavoriteMutationVariables
  >(ADD_FAVORITE);
  const [removeFavoriteMutation] = useMutation<
    RemoveFavoriteMutation,
    RemoveFavoriteMutationVariables
  >(REMOVE_FAVORITE);

  const favoriteIds = useMemo(
    () => new Set(data?.myFavoriteStayIds ?? []),
    [data],
  );

  const favorites = useMemo(() => {
    const record: Record<string, boolean> = {};
    favoriteIds.forEach((id) => {
      record[id.toString()] = true;
    });
    return record;
  }, [favoriteIds]);

  const toggleFavorite = useCallback(
    (idString: string) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const stayId = Number(idString);
      const wasFavorite = favoriteIds.has(stayId);
      const nextIds = wasFavorite
        ? [...favoriteIds].filter((id) => id !== stayId)
        : [...favoriteIds, stayId];

      const syncListQuery = (cache: ApolloCache) =>
        cache.writeQuery<MyFavoriteStayIdsQuery>({
          query: MY_FAVORITE_STAY_IDS,
          data: { myFavoriteStayIds: nextIds },
        });

      if (wasFavorite) {
        void removeFavoriteMutation({
          variables: { stayId },
          optimisticResponse: { removeFavorite: true },
          update: syncListQuery,
        });
      } else {
        void addFavoriteMutation({
          variables: { stayId },
          optimisticResponse: { addFavorite: true },
          update: syncListQuery,
        });
      }
    },
    [user, navigate, favoriteIds, addFavoriteMutation, removeFavoriteMutation],
  );

  return { favorites, toggleFavorite };
}
