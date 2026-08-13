import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StaySummary } from '@/api/chat';
import { MiniStayCard } from './MiniStayCard';

interface ChatbotStayListProps {
  stays: StaySummary[];
}

/**
 * ChatbotStayList renders a horizontal carousel of recommended stay cards
 * with desktop scroll navigation controls.
 */
export function ChatbotStayList({ stays }: ChatbotStayListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayedStays = stays.slice(0, 5);

  if (displayedStays.length === 0) return null;

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
  };

  return (
    <div className="w-full mt-2 self-start max-w-[100%]">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-semibold text-frui-blue/70">
          Recommended Stays
        </span>
        {displayedStays.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleScrollLeft}
              aria-label="Previous stays"
              className="p-1 rounded-full bg-frui-white text-frui-blue border border-frui-blue/15 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              aria-label="Next stays"
              className="p-1 rounded-full bg-frui-white text-frui-blue border border-frui-blue/15 shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none w-full scroll-smooth"
      >
        {displayedStays.map((stay) => (
          <MiniStayCard key={stay.publicId || stay.id} stay={stay} />
        ))}
      </div>
    </div>
  );
}
