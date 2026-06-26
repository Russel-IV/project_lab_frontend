import { Skeleton } from '@/components/ui/skeleton';

export function StayCardSkeleton() {
  return (
    <div className="relative overflow-hidden w-full aspect-[4/3] rounded-2xl border border-border bg-card p-0">
      {/* Main Image Skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-muted/40" />

      {/* Rating Tag Skeleton */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md shadow-xs">
        <Skeleton className="h-4 w-24 bg-muted/60" />
      </div>

      {/* Favorite Button Skeleton */}
      <div className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md">
        <Skeleton className="size-5 rounded-full bg-muted/60" />
      </div>

      {/* Bottom Section Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5 z-10">
        <div className="flex justify-between items-end w-full">
          <div className="flex flex-col gap-2 text-left w-2/3">
            {/* Title */}
            <Skeleton className="h-5 w-4/5 bg-white/30" />
            {/* Location */}
            <Skeleton className="h-3.5 w-1/2 bg-white/30" />
          </div>
          <div className="flex flex-col items-end gap-1.5 w-1/4">
            {/* Price */}
            <Skeleton className="h-6 w-full bg-white/30" />
            {/* Total tag */}
            <Skeleton className="h-3 w-1/2 bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
