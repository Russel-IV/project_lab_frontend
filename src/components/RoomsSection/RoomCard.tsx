import { BedDouble } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format';
import { AMENITIES_LOOKUP } from '@/constants/amenities';
import type { RoomsSectionRoom } from './RoomsSection';

interface RoomCardProps {
  room: RoomsSectionRoom;
  nights: number;
  isSelected: boolean;
  unavailable: boolean;
  onToggle: (room: RoomsSectionRoom) => void;
}

export function RoomCard({
  room,
  nights,
  isSelected,
  unavailable,
  onToggle,
}: RoomCardProps) {
  const primaryPicture =
    room.pictures.find((p) => p.isPrimary) ?? room.pictures[0];
  const primaryPictureUrl = primaryPicture?.thumbnailUrl ?? primaryPicture?.url;
  const totalPrice = room.price * nights;
  const amenities = room.amenities
    .map((a) => AMENITIES_LOOKUP[a.id])
    .filter(Boolean);

  return (
    <Card className={`flex-row gap-4 p-4 ${unavailable ? 'opacity-60' : ''}`}>
      <div className="size-20 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {primaryPictureUrl ? (
          <img
            src={primaryPictureUrl}
            alt={room.name}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          <BedDouble className="size-8 text-muted-foreground" />
        )}
      </div>

      <CardContent className="flex-1 flex flex-col gap-2 px-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground text-sm">
              {room.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sleeps {room.sleeps}
              {room.bedroomAmount > 0 &&
                ` · ${room.bedroomAmount} bedroom${room.bedroomAmount === 1 ? '' : 's'}`}
            </p>
          </div>
          {unavailable && (
            <Badge variant="secondary">Unavailable for these dates</Badge>
          )}
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {amenities.map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div key={idx} className="flex items-center gap-1">
                  <Icon className="size-3.5 text-primary shrink-0" />
                  <span>{amenity.name}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end justify-between gap-2 mt-auto">
          <div className="text-xs text-muted-foreground">
            <div className="font-semibold text-foreground text-sm">
              {formatPrice(room.price)}{' '}
              <span className="font-normal text-muted-foreground">/ night</span>
            </div>
            {nights > 1 && <div>{formatPrice(totalPrice)} total</div>}
          </div>

          {!unavailable && (
            <Button
              type="button"
              size="sm"
              variant={isSelected ? 'secondary' : 'default'}
              onClick={() => onToggle(room)}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RoomCard;
