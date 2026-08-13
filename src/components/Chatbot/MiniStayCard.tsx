import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { StaySummary } from '@/api/chat';
import { formatPrice } from '@/utils/format';

interface MiniStayCardProps {
  stay: StaySummary;
}

export function MiniStayCard({ stay }: MiniStayCardProps) {
  const priceDisplay =
    typeof stay.startingFromPrice === 'number'
      ? `${formatPrice(stay.startingFromPrice)}/night`
      : null;

  return (
    <Link
      to={`/stay/${stay.publicId}`}
      className="shrink-0 w-[calc(50%-5px)] bg-frui-white border border-frui-blue/10 rounded-xl overflow-hidden shadow-xs flex flex-col no-underline text-inherit select-none"
    >
      <div className="relative w-full h-24 bg-frui-placeholder overflow-hidden">
        {stay.imageUrl ? (
          <img
            src={stay.imageUrl}
            alt={stay.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-frui-placeholder" />
        )}
        {typeof stay.starRating === 'number' && (
          <div className="absolute top-2 left-2 bg-frui-white/95 backdrop-blur-xs flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-frui-blue shadow-xs">
            <Star className="size-3 fill-frui-orange text-frui-orange" />
            <span>{stay.starRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-1 flex-1 justify-between">
        <div>
          <h4 className="text-xs font-bold text-frui-blue line-clamp-1 m-0 leading-tight">
            {stay.name}
          </h4>
          {stay.city && (
            <div className="flex items-center gap-1 text-[11px] text-frui-blue/70 font-medium mt-0.5">
              <MapPin className="size-3 shrink-0 text-frui-orange" />
              <span className="line-clamp-1">
                {stay.city}
                {stay.countryCode ? `, ${stay.countryCode}` : ''}
              </span>
            </div>
          )}
        </div>

        {priceDisplay && (
          <div className="text-[11px] font-bold text-frui-orange mt-1">
            {priceDisplay}
          </div>
        )}
      </div>
    </Link>
  );
}
