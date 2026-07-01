import { SearchForm } from '@/components/SearchForm';
import { Sections } from '../components/Sections';
import PresentationGallery from '../components/PresentationGallery/PresentationGallery';

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center pt-2 pb-16 gap-10">
      <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-left w-full">
          <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-[#121324] leading-tight !mb-2">
            Discover your next escape
          </h1>
          <p className="text-base sm:text-lg text-[#5c5d6b] font-normal">
            Find exclusive deals on hotels, flights, and car rentals.
          </p>
        </div>

        {/* Categories shown only on desktop */}
        <div className="hidden md:block">
          <Sections />
        </div>

        {/* Unified Responsive Search Form */}
        <SearchForm />
      </section>

      <PresentationGallery />
    </div>
  );
}
