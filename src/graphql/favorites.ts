import { gql } from '@apollo/client';

// `myFavoriteStayIds` / `addFavorite` / `removeFavorite` don't exist in the
// backend schema yet, so `pnpm codegen` can't generate types for them. The
// result/variable types below are hand-written to match the agreed contract
// (see the backend handoff spec). Once the backend ships the feature, run
// `pnpm codegen`, switch these operations to import their types from
// `@/types/__generated__/graphql` instead, and delete the local types here.

export const MY_FAVORITE_STAY_IDS = gql`
  query MyFavoriteStayIds {
    myFavoriteStayIds
  }
`;

export interface MyFavoriteStayIdsQuery {
  myFavoriteStayIds: number[];
}

export const ADD_FAVORITE = gql`
  mutation AddFavorite($stayId: Int!) {
    addFavorite(stayId: $stayId)
  }
`;

export interface AddFavoriteMutation {
  addFavorite: boolean;
}

export interface AddFavoriteMutationVariables {
  stayId: number;
}

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($stayId: Int!) {
    removeFavorite(stayId: $stayId)
  }
`;

export interface RemoveFavoriteMutation {
  removeFavorite: boolean;
}

export interface RemoveFavoriteMutationVariables {
  stayId: number;
}
