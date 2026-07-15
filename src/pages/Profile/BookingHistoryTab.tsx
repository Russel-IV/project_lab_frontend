import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { parse, format } from 'date-fns';
import { CalendarDays, ShieldAlert, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, type badgeVariants } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
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
import { MY_BOOKINGS, DELETE_BOOKING } from '@/graphql/bookings';
import type {
  MyBookingsQuery,
  MyBookingsQueryVariables,
  DeleteBookingMutation,
  DeleteBookingMutationVariables,
  BookingStatus,
} from '@/types/__generated__/graphql';
import { formatPrice } from '@/utils/format';
import type { VariantProps } from 'class-variance-authority';

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_BADGE_VARIANT: Record<
  BookingStatus,
  NonNullable<VariantProps<typeof badgeVariants>['variant']>
> = {
  PENDING: 'outline',
  CONFIRMED: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

function formatBookingDate(date: unknown): string {
  const raw = String(date);
  try {
    return format(parse(raw, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy');
  } catch {
    return raw;
  }
}

export function BookingHistoryTab() {
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data, loading, error } = useQuery<
    MyBookingsQuery,
    MyBookingsQueryVariables
  >(MY_BOOKINGS, { variables: { page: 0, size: 50 } });

  const [deleteBooking, { loading: cancelling }] = useMutation<
    DeleteBookingMutation,
    DeleteBookingMutationVariables
  >(DELETE_BOOKING, { refetchQueries: ['MyBookings'] });

  const handleCancel = async (id: number) => {
    setCancelError(null);
    try {
      await deleteBooking({ variables: { id } });
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    }
  };

  const bookings = data?.myBookings ?? [];

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Booking History</CardTitle>
        <CardDescription>Your past and upcoming stays.</CardDescription>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading your bookings…
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Unable to load your bookings right now.
          </p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You haven&apos;t made any bookings yet.
          </p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="flex flex-col">
            {bookings.map((booking, i) => {
              const canCancel =
                booking.status === 'PENDING' || booking.status === 'CONFIRMED';
              const roomNames = booking.rooms.map((r) => r.name).join(', ');
              const stayId = booking.rooms[0]?.stayId;

              return (
                <Fragment key={booking.id}>
                  {i > 0 && <div className="border-t border-border" />}
                  <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {roomNames || `Booking #${booking.id}`}
                        </p>
                        <Badge variant={STATUS_BADGE_VARIANT[booking.status]}>
                          {STATUS_LABEL[booking.status]}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5 shrink-0" />
                        {`${formatBookingDate(booking.checkInDate)} – ${formatBookingDate(booking.checkOutDate)}`}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="size-3.5 shrink-0" />
                        {`${booking.guestsCount} ${
                          booking.guestsCount === 1 ? 'guest' : 'guests'
                        } · ${formatPrice(booking.totalPrice, true)}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {stayId != null && (
                        <Button
                          variant="secondary"
                          size="sm"
                          render={<Link to={`/stay/${stayId}`} />}
                          nativeButton={false}
                        >
                          View stay
                        </Button>
                      )}
                      {canCancel && (
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button variant="destructive" size="sm">
                                Cancel booking
                              </Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel this booking?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This can&apos;t be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={cancelling}
                                onClick={() => handleCancel(booking.id)}
                              >
                                Cancel booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}

        {cancelError && (
          <p className="mt-4 flex items-center gap-1 text-xs font-medium text-destructive">
            <ShieldAlert className="size-3.5 shrink-0" />
            {cancelError}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default BookingHistoryTab;
