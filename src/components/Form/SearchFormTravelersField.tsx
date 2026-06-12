import React, { useState } from 'react';
import { User, Plus, Minus } from 'lucide-react';
import { useSearchForm } from './SearchFormContext';
import { FormField } from './FormField';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type RoomConfig,
  parseTravelersValue,
  serializeTravelersValue,
} from './searchFormUtils';

export const SearchFormTravelersField: React.FC = () => {
  const { travelersValue, onTravelersChange } = useSearchForm();
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(travelersValue),
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setRooms(parseTravelersValue(travelersValue));
    } else {
      const formatted = serializeTravelersValue(rooms);
      onTravelersChange(formatted);
    }
  };

  const updateAdults = (roomId: number, delta: number) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const nextAdults = Math.max(1, Math.min(14, room.adults + delta));
          return { ...room, adults: nextAdults };
        }
        return room;
      }),
    );
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        adults: 1, // default to 1 adult for a new room
      },
    ]);
  };

  const removeRoom = (roomId: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleDone = () => {
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <FormField
            label="Travelers"
            value={travelersValue}
            onClick={() => {}}
            icon={<User className="w-5 h-5" strokeWidth={1.5} />}
          />
        }
      />
      <PopoverContent
        side="bottom"
        align="start"
        collisionAvoidance={{ side: 'none', fallbackAxisSide: 'none' }}
        className="w-[340px] p-5 bg-white border border-[#d6c7b9] rounded-lg shadow-xl text-[#121324] z-50 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="flex flex-col gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
            >
              <span className="font-bold text-foreground text-sm">
                Room {index + 1}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  Adults
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => updateAdults(room.id, -1)}
                    disabled={room.adults <= 1}
                    className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted/30 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Minus className="size-4 text-foreground" />
                  </button>
                  <span className="w-4 text-center font-medium text-sm select-none">
                    {room.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateAdults(room.id, 1)}
                    disabled={room.adults >= 14}
                    className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted/30 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Plus className="size-4 text-foreground" />
                  </button>
                </div>
              </div>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-xs text-primary font-semibold hover:underline self-end cursor-pointer bg-transparent border-0 p-0"
                >
                  Remove room
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRoom}
          className="text-sm text-primary font-semibold hover:underline self-end cursor-pointer flex items-center gap-1 mt-1 bg-transparent border-0 p-0"
        >
          <Plus className="size-4" /> Add another room
        </button>

        <div className="flex justify-end items-center pt-3 border-t border-border/80 mt-2">
          <button
            type="button"
            onClick={handleDone}
            className="bg-primary hover:bg-primary/95 text-white font-medium rounded-full px-5 py-1.5 text-sm cursor-pointer border-0"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFormTravelersField;
