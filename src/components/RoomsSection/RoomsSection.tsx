import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { AVAILABLE_ROOMS } from '@/graphql/stays';
import type {
  AvailableRoomsQuery,
  AvailableRoomsQueryVariables,
  GetStayDetailsQuery,
} from '@/types/__generated__/graphql';
import {
  isValidDateRange,
  parseISOToDateRange,
} from '@/components/SearchForm/searchFormUtils';
import { calculateNights } from '@/utils/date';
import { formatPrice } from '@/utils/format';
import { RoomCard } from './RoomCard';

type GraphQLStay = NonNullable<GetStayDetailsQuery['stay']>;
export type RoomsSectionRoom = GraphQLStay['rooms'][number];

interface RoomsSectionProps {
  stayId: number;
  rooms: RoomsSectionRoom[];
  checkIn: string;
  checkOut: string;
  selectedRoomIds: number[];
  onToggle: (room: RoomsSectionRoom) => void;
}

export function RoomsSection({
  stayId,
  rooms,
  checkIn,
  checkOut,
  selectedRoomIds,
  onToggle,
}: RoomsSectionProps) {
  const hasValidDates = isValidDateRange(checkIn, checkOut);

  const { data, error } = useQuery<
    AvailableRoomsQuery,
    AvailableRoomsQueryVariables
  >(AVAILABLE_ROOMS, {
    variables: { stayId, checkIn, checkOut },
    skip: !hasValidDates,
  });

  const nights = useMemo(
    () => calculateNights(parseISOToDateRange(checkIn, checkOut)),
    [checkIn, checkOut],
  );

  // Only treat availability data as authoritative once it has actually
  // loaded without error; otherwise every room is shown as available rather
  // than blocking the whole list on a flaky query.
  const availableRoomIds = useMemo(() => {
    if (error || !data) return null;
    return new Set(data.availableRooms.map((r) => r.id));
  }, [data, error]);

  if (!hasValidDates) {
    return (
      <p className="text-sm text-muted-foreground">
        Choose your dates to see room availability and pricing.
      </p>
    );
  }

  const selectedRooms = rooms.filter((room) =>
    selectedRoomIds.includes(room.id),
  );
  const selectedTotal = selectedRooms.reduce(
    (sum, room) => sum + room.price * nights,
    0,
  );

  return (
    <div className="flex flex-col gap-3">
      {selectedRooms.length > 0 && (
        <p className="text-sm font-medium text-foreground">
          {selectedRooms.length} {selectedRooms.length === 1 ? 'room' : 'rooms'}{' '}
          selected · {formatPrice(selectedTotal)} total
        </p>
      )}
      {rooms.map((room) => {
        const unavailable =
          availableRoomIds !== null && !availableRoomIds.has(room.id);
        return (
          <RoomCard
            key={room.id}
            room={room}
            nights={nights}
            isSelected={selectedRoomIds.includes(room.id)}
            unavailable={unavailable}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}

export default RoomsSection;
