import { SearchForm } from '@/components/SearchForm';
import { MobileSections } from '../components/Sections';
import PresentationGallery from '../components/PresentationGallery/PresentationGallery';

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center pb-16 gap-10">
      <div className="w-full md:hidden">
        <MobileSections />
      </div>

      {/* Unified Responsive Search Form: kept as a direct child of the
          full-height page column so its sticky position tracks the whole
          page scroll instead of only the short heading section below. */}
      <SearchForm sticky />

      <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 pt-2">
        <div className="mb-8 text-left w-full">
          <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-[#121324] leading-tight !mb-2">
            Discover your next escape
          </h1>
          <p className="text-base sm:text-lg text-[#5c5d6b] font-normal">
            Find exclusive deals on hotels, flights, and car rentals.
          </p>
        </div>
      </section>

      <PresentationGallery />
    </div>
  );
}
