import { TriangleAlert, ShieldAlert } from 'lucide-react';
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
import { useAccountSettingsContext } from './AccountSettingsContext';

export function DeleteAccountTab() {
  const { handleDeleteAccount, deletingAccount, deleteAccountError } =
    useAccountSettingsContext();

  return (
    <section className="pb-8 max-w-md flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-frui-blue">Delete Account</h2>
      <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4">
        <TriangleAlert className="size-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-destructive">
          Deleting your account is permanent and cannot be undone. All of your
          personal information, saved payment methods, and booking history will
          be permanently removed.
        </p>
      </div>

      {deleteAccountError && (
        <span className="text-xs text-destructive font-medium flex items-center gap-1">
          <ShieldAlert className="size-3.5 shrink-0" />
          {deleteAccountError}
        </span>
      )}

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="destructive"
              disabled={deletingAccount}
              className="self-start"
            >
              {deletingAccount ? 'Deleting…' : 'Delete my account'}
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
    </section>
  );
}

export default DeleteAccountTab;
