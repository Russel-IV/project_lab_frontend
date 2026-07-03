import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useSearchForm } from './SearchFormContext';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type RoomConfig,
  parseTravelersValue,
  serializeTravelersValue,
} from '../searchFormUtils';

interface SearchFormTravelersFieldProps {
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export const SearchFormTravelersField: React.FC<
  SearchFormTravelersFieldProps
> = ({ isActive, onActivate, onDeactivate }) => {
  const { travelersValue, onTravelersChange } = useSearchForm();
  const [rooms, setRooms] = useState<RoomConfig[]>(() =>
    parseTravelersValue(travelersValue),
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setRooms(parseTravelersValue(travelersValue));
      onActivate();
    } else {
      const formatted = serializeTravelersValue(rooms);
      onTravelersChange(formatted);
      onDeactivate();
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
    <Popover open={isActive} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <div
            onClick={onActivate}
            className={cn(
              'flex flex-col flex-1 px-4 xl:px-8 py-2.5 xl:py-3 rounded-full cursor-pointer justify-center min-w-0 transition-all duration-150 select-none',
              isActive
                ? 'bg-frui-white shadow-[0_3px_12px_rgba(0,0,0,0.08)]'
                : 'bg-transparent',
            )}
          >
            <span className="text-[10px] xl:text-xs font-bold text-frui-blue uppercase tracking-wider select-none mb-0.5">
              Travelers
            </span>
            <span
              className={cn(
                'text-xs xl:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis',
                travelersValue ? 'text-frui-blue' : 'text-gray-400',
              )}
            >
              {travelersValue || 'How many?'}
            </span>
          </div>
        }
      />
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={14}
        collisionAvoidance={{ side: 'none', fallbackAxisSide: 'none' }}
        className="w-[340px] p-5 bg-frui-white border border-[#d6c7b9]/50 rounded-2xl shadow-xl text-frui-blue z-50 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="flex flex-col gap-3 pb-4 border-b border-[#d6c7b9]/30 last:border-0 last:pb-0"
            >
              <span className="font-bold text-frui-blue text-sm">
                Room {index + 1}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-frui-blue">
                  Adults
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => updateAdults(room.id, -1)}
                    disabled={room.adults <= 1}
                    className="size-8 rounded-full border border-[#d6c7b9]/40 flex items-center justify-center hover:bg-frui-cream active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Minus className="size-4 text-frui-blue" />
                  </button>
                  <span className="w-4 text-center font-medium text-sm select-none">
                    {room.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateAdults(room.id, 1)}
                    disabled={room.adults >= 14}
                    className="size-8 rounded-full border border-[#d6c7b9]/40 flex items-center justify-center hover:bg-frui-cream active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Plus className="size-4 text-frui-blue" />
                  </button>
                </div>
              </div>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-xs text-frui-orange font-semibold hover:underline self-end cursor-pointer bg-transparent border-0 p-0"
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
          className="text-sm text-frui-orange font-semibold hover:underline self-end cursor-pointer flex items-center gap-1 mt-1 bg-transparent border-0 p-0"
        >
          <Plus className="size-4" /> Add another room
        </button>

        <div className="flex justify-end items-center pt-3 border-t border-[#d6c7b9]/30 mt-2">
          <button
            type="button"
            onClick={handleDone}
            className="bg-frui-orange hover:bg-[#cf5505] text-frui-white font-medium rounded-full px-5 py-1.5 text-sm cursor-pointer border-0"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFormTravelersField;
