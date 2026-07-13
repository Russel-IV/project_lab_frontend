import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useAccountSettingsContext } from './AccountSettingsContext';

export function DeleteAccountTab() {
  const { handleDeleteAccount, deletingAccount, deleteAccountError } =
    useAccountSettingsContext();

  return (
    <Card className="ring-destructive/40">
      <CardHeader className="border-b border-destructive/30">
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions that affect your entire account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">
              Delete your account
            </p>
            <p className="text-xs text-muted-foreground max-w-md">
              Permanently removes your personal information, saved payment
              methods, and booking history. This cannot be undone.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deletingAccount}
                  className="shrink-0"
                >
                  {deletingAccount ? 'Deleting…' : 'Delete account'}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete your account?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {deleteAccountError && (
          <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-4">
            <ShieldAlert className="size-3.5 shrink-0" />
            {deleteAccountError}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export default DeleteAccountTab;
