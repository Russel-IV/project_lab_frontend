import StayPhotoGallery from '@/StayPhotoGallery/StayPhotoGallery';

export default function StayInfoPage() {
  return (
    <div className="flex-1 w-full bg-background py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground tracking-tight m-0 select-none">
          Beach House | Viña del Mar
        </h1>
        <StayPhotoGallery />
      </div>
    </div>
  );
}
