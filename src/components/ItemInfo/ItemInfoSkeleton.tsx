import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Star } from 'lucide-react';

export function ItemInfoSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full h-full rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden ${className}`}
    >
      {/* Scrollable details skeleton */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* 1. Image Gallery Grid Skeleton */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-xs shrink-0">
          {/* Main Image */}
          <Skeleton className="col-span-2 row-span-2 rounded-none bg-muted/40" />
          {/* Top Sub-image */}
          <Skeleton className="col-span-1 row-span-1 rounded-none bg-muted/40" />
          {/* Bottom Sub-image */}
          <Skeleton className="col-span-1 row-span-1 rounded-none bg-muted/40" />
        </div>

        {/* 2. Title & Metadata Header Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-7 w-3/4 bg-muted/60" />
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-muted-foreground/40" />
              <Skeleton className="h-4 w-32 bg-muted/60" />
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="size-4 text-muted-foreground/30 fill-muted-foreground/20" />
              <Skeleton className="h-4 w-40 bg-muted/60" />
            </div>
          </div>
        </div>

        {/* 3. About Section Skeleton */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
            About this space
          </h3>
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full bg-muted/60" />
            <Skeleton className="h-4 w-full bg-muted/60" />
            <Skeleton className="h-4 w-5/6 bg-muted/60" />
          </div>
        </div>

        {/* 4. Amenities Section Skeleton */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-1.5">
            What this place offers
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Skeleton className="size-4.5 rounded-full bg-muted/60" />
                <Skeleton className="h-4 w-2/3 bg-muted/60" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Sticky Footer Container Skeleton */}
      <div className="border-t border-border bg-card p-5 shrink-0 flex items-center justify-between z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-24 bg-muted/60" />
          <Skeleton className="h-3.5 w-36 bg-muted/60" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-xl bg-muted/60" />
          <Skeleton className="h-10 w-24 rounded-xl bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
