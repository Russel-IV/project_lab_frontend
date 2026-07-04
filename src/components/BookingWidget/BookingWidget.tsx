import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BookingWidgetDesktop } from './Desktop/BookingWidgetDesktop';
import { BookingWidgetMobile } from './Mobile/BookingWidgetMobile';
import { BookingWidgetContext } from './BookingWidgetContext';
import type { GetStayDetailsQuery } from '@/types/__generated__/graphql';

type GraphQLStay = NonNullable<GetStayDetailsQuery['stay']>;

interface BookingWidgetProps {
  stay: GraphQLStay | null | undefined;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ stay }) => {
  const isMobile = useIsMobile();

  return (
    <BookingWidgetContext.Provider value={{ stay }}>
      {isMobile ? <BookingWidgetMobile /> : <BookingWidgetDesktop />}
    </BookingWidgetContext.Provider>
  );
};

export { BookingWidgetDesktop, BookingWidgetMobile };
export default BookingWidget;
