import { createContext, useContext } from 'react';
import type { GetStayDetailsQuery } from '@/types/__generated__/graphql';

type GraphQLStay = NonNullable<GetStayDetailsQuery['stay']>;

export interface BookingWidgetContextProps {
  stay: GraphQLStay | null | undefined;
}

export const BookingWidgetContext = createContext<
  BookingWidgetContextProps | undefined
>(undefined);

export const useBookingWidget = () => {
  const context = useContext(BookingWidgetContext);
  if (!context) {
    throw new Error(
      'useBookingWidget must be used within a BookingWidgetProvider',
    );
  }
  return context;
};
