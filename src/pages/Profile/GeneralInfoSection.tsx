import { useRef, type BaseSyntheticEvent, type ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { UserRound, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import type { GeneralInfoFormValues } from './profileSchema';

interface GeneralInfoSectionProps {
  profilePictureUrl: string | null;
  onUploadPicture: (file: File) => Promise<void>;
  uploadingPicture: boolean;
  pictureError: string | null;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function GeneralInfoSection({
  profilePictureUrl,
  onUploadPicture,
  uploadingPicture,
  pictureError,
  onSubmit,
}: GeneralInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<GeneralInfoFormValues>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      void onUploadPicture(file);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This information may be visible to other users of Frui.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate className="contents">
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-foreground/10">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile picture"
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-7 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploadingPicture}
                onClick={() => fileInputRef.current?.click()}
                className="self-start"
              >
                {uploadingPicture ? 'Uploading…' : 'Change picture'}
              </Button>
              {pictureError && (
                <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5">
                  <ShieldAlert className="size-3 shrink-0" />
                  {pictureError}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 max-w-sm">
            <label className="text-sm font-medium text-foreground">
              Full name
            </label>
            <Input
              {...register('name')}
              aria-invalid={!!errors.name}
              className="h-10"
            />
            {errors.name && (
              <span className="text-xs text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                <ShieldAlert className="size-3 shrink-0" />
                {errors.name.message}
              </span>
            )}
          </div>

          {errors.root && (
            <span className="text-xs text-destructive font-medium flex items-center gap-1">
              <ShieldAlert className="size-3.5 shrink-0" />
              {errors.root.message}
            </span>
          )}
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default GeneralInfoSection;
