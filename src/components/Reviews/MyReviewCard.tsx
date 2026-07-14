import { StarRating } from '@/components/ui/star-rating';

export interface MyReviewCardProps {
  rating: number;
  text: string;
  userName: string;
}

export function MyReviewCard({ rating, text, userName }: MyReviewCardProps) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Your review</span>
        <StarRating value={rating} readOnly size="sm" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      <div className="text-sm font-bold text-foreground">{userName}</div>
    </div>
  );
}
