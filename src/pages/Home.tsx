import { useState } from 'react';
import SearchForm from '../components/Form/SearchForm';
import { BedDouble, Plane, Car, Ticket, Ship } from 'lucide-react';
import PresentationGallery from '../components/PresentationGallery/PresentationGallery';
import {
  SearchFormMobile,
  SearchFormMobileTrigger,
} from '@/components/SearchFormMobile';

export default function Home() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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

        {/* Desktop Search Form */}
        <div className="hidden md:block">
          <SearchForm>
            <SearchForm.Tabs>
              <SearchForm.Tab id="stays" icon={BedDouble}>
                STAYS
              </SearchForm.Tab>
              <SearchForm.Tab id="flights" icon={Plane}>
                FLIGHTS
              </SearchForm.Tab>
              <SearchForm.Tab id="cars" icon={Car}>
                CARS
              </SearchForm.Tab>
              <SearchForm.Tab id="things" icon={Ticket}>
                THINGS TO DO
              </SearchForm.Tab>
              <SearchForm.Tab id="cruises" icon={Ship}>
                CRUISES
              </SearchForm.Tab>
            </SearchForm.Tabs>
            <SearchForm.Grid>
              <SearchForm.PlaceField />
              <SearchForm.DatesField />
              <SearchForm.TravelersField />
              <SearchForm.Submit />
            </SearchForm.Grid>
          </SearchForm>
        </div>

        {/* Mobile Search Trigger & Modal */}
        <div className="block md:hidden">
          <SearchFormMobileTrigger
            onClick={() => setIsMobileSearchOpen(true)}
          />
          {isMobileSearchOpen && (
            <SearchFormMobile
              isOpen={isMobileSearchOpen}
              onClose={() => setIsMobileSearchOpen(false)}
            />
          )}
        </div>
      </section>

      <PresentationGallery />
    </div>
  );
}
