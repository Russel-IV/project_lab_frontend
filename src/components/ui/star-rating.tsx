import { useState } from 'react';
import { Star } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const starRatingVariants = cva('inline-flex items-center gap-0.5', {
  variants: {
    size: {
      default: '[&_svg]:size-5',
      sm: '[&_svg]:size-4',
      lg: '[&_svg]:size-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface StarRatingProps extends VariantProps<
  typeof starRatingVariants
> {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  'aria-label'?: string;
}

function StarRating({
  value,
  onChange,
  readOnly = false,
  size,
  className,
  'aria-label': ariaLabel = 'Rating',
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  if (readOnly) {
    return (
      <div
        data-slot="star-rating"
        role="img"
        aria-label={`${value} out of 5 stars`}
        className={cn(starRatingVariants({ size }), className)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'shrink-0',
              star <= value
                ? 'fill-amber-500 text-amber-500'
                : 'fill-muted-foreground/20 text-muted-foreground/20',
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="star-rating"
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(starRatingVariants({ size }), className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          className="cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
          onMouseEnter={() => setHoverValue(star)}
          onClick={() => onChange?.(star)}
        >
          <Star
            className={cn(
              'shrink-0 transition-colors',
              star <= displayValue
                ? 'fill-amber-500 text-amber-500'
                : 'fill-muted-foreground/20 text-muted-foreground/20',
            )}
          />
        </button>
      ))}
    </div>
  );
}

export { StarRating };
