import { useState } from 'react';

import { StarRating } from '@/components/ui/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export interface ReviewFormProps {
  onSubmit: (rating: number, text: string) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export function ReviewForm({
  onSubmit,
  onCancel,
  submitting = false,
  submitError,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    const nextRatingError = rating === 0 ? 'Please select a rating' : null;
    const nextTextError = trimmedText === '' ? 'Please write a review' : null;

    setRatingError(nextRatingError);
    setTextError(nextTextError);

    if (nextRatingError || nextTextError) return;

    await onSubmit(rating, trimmedText);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-muted/30"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Your rating</span>
        <StarRating
          value={rating}
          onChange={(value) => {
            setRating(value);
            setRatingError(null);
          }}
          aria-label="Your rating"
        />
        {ratingError && (
          <p className="text-sm text-destructive">{ratingError}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="review-text"
          className="text-sm font-medium text-foreground"
        >
          Your review
        </label>
        <Textarea
          id="review-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.trim() !== '') setTextError(null);
          }}
          placeholder="Share your experience with other travelers..."
          rows={4}
        />
        {textError && <p className="text-sm text-destructive">{textError}</p>}
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
