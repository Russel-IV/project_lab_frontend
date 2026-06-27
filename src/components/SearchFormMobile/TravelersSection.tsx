import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useSearchFormMobile } from './SearchFormMobileContext';

/**
 * TravelersSection
 *
 * Renders the room guest quantity adjusters.
 * Supports collapsed and expanded accordion modes.
 */
export const TravelersSection: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    rooms,
    updateAdults,
    addRoom,
    removeRoom,
    localTravelers,
  } = useSearchFormMobile();

  const isExpanded = activeSection === 'travelers';

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setActiveSection('travelers')}
        className="bg-frui-white rounded-2xl p-4 flex justify-between items-center shadow-sm cursor-pointer select-none text-left w-full border-0"
      >
        <span className="text-sm text-[#877D74] font-medium">Travelers</span>
        <span className="text-sm text-frui-blue font-bold">
          {localTravelers}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-frui-white rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-frui-blue">Who is travelling?</h2>

      <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className="flex flex-col gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-frui-blue text-sm">
                Room {index + 1}
              </span>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-xs text-frui-orange font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Delete Room
                </button>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-frui-blue">Adults</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateAdults(room.id, -1)}
                  disabled={room.adults <= 1}
                  className="w-8 h-8 rounded-full border border-[#d6c7b9] flex items-center justify-center hover:bg-neutral-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Minus className="h-4 w-4 text-frui-blue" />
                </button>
                <span className="w-4 text-center font-bold text-sm select-none text-frui-blue">
                  {room.adults}
                </span>
                <button
                  type="button"
                  onClick={() => updateAdults(room.id, 1)}
                  disabled={room.adults >= 14}
                  className="w-8 h-8 rounded-full border border-[#d6c7b9] flex items-center justify-center hover:bg-neutral-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-frui-blue" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRoom}
        className="text-sm text-frui-orange font-bold hover:underline cursor-pointer flex items-center gap-1 mt-1 bg-transparent border-0 p-0 self-start"
      >
        <Plus className="h-4 w-4" /> Add room
      </button>
    </div>
  );
};

export default TravelersSection;
