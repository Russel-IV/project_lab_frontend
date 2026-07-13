import { useRef, type BaseSyntheticEvent, type ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { UserRound, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <section className="border-b pb-8">
      <h2 className="text-lg font-semibold mb-4 text-frui-blue">
        General Info
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-foreground/10">
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile picture"
              className="size-full object-cover"
            />
          ) : (
            <UserRound className="size-8 text-muted-foreground" />
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
            variant="outline"
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

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-md"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-frui-blue">Full name</label>
          <Input
            {...register('name')}
            aria-invalid={!!errors.name}
            className="h-10 border-neutral-300 focus-visible:border-frui-orange focus-visible:ring-frui-orange/20"
          />
          {errors.name && (
            <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="self-start bg-frui-orange text-frui-white border-0"
        >
          {isSubmitting ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </section>
  );
}

export default GeneralInfoSection;
