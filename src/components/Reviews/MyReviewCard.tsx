import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export interface MyReviewCardProps {
  rating: number;
  text: string;
  userName: string;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}

export function MyReviewCard({
  rating,
  text,
  userName,
  onEdit,
  onDelete,
  deleting = false,
}: MyReviewCardProps) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Your review</span>
        <StarRating value={rating} readOnly size="sm" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-bold text-foreground">{userName}</div>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2 shrink-0">
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="destructive" size="sm">
                      Delete review
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={deleting} onClick={onDelete}>
                      Delete review
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
