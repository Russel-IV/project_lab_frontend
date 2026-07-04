import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

// Mobile subcomponents & state
import {
  SearchFormMobileContext,
  type SearchFormMobileContextProps,
} from './Mobile/SearchFormMobileContext';
import { WhereSection } from './Mobile/WhereSection';
import { DatesSection } from './Mobile/DatesSection';
import { TravelersSection } from './Mobile/TravelersSection';
import { useSearchFormMobileState } from './Mobile/useSearchFormMobileState';
import { SearchFormMobileTrigger } from './Mobile/SearchFormMobileTrigger';

// Desktop subcomponents, context & styles
import { useSearchForm } from './Desktop/SearchFormContext';
import { SearchFormProvider } from './Desktop/SearchFormProvider';
import { SearchFormPlaceField } from './Desktop/SearchFormPlaceField';
import { SearchFormDatesField } from './Desktop/SearchFormDatesField';
import { SearchFormTravelersField } from './Desktop/SearchFormTravelersField';
import { FormSubmit } from './Desktop/FormSubmit';
import './Desktop/SearchForm.css';

interface SearchFormMobileProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActiveSection?: 'where' | 'dates' | 'travelers';
  onSubmit?: (data: {
    checkIn: string;
    checkOut: string;
    travelers: string;
  }) => void;
  submitButtonText?: string;
  hideWhereSection?: boolean;
}

/**
 * SearchFormMobile
 *
 * Full screen search form modal for mobile screens.
 * Orchestrates the search form state and layout sections via context.
 */
export const SearchFormMobile: React.FC<SearchFormMobileProps> = ({
  isOpen,
  onClose,
  defaultActiveSection,
  onSubmit,
  submitButtonText,
  hideWhereSection = false,
}) => {
  const formState = useSearchFormMobileState({
    isOpen,
    onClose,
    defaultActiveSection,
    onSubmit,
    hideWhereSection,
  });

  const contextValue: SearchFormMobileContextProps = {
    ...formState,
    onClose,
  };

  if (!isOpen) return null;

  return (
    <SearchFormMobileContext.Provider value={contextValue}>
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F2F2F2] overflow-y-auto select-none p-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="self-end w-10 h-10 flex items-center justify-center bg-frui-white border border-[#d6c7b9] rounded-full shadow-sm text-frui-blue cursor-pointer mb-6"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main accordion list */}
        <div className="flex flex-col gap-4 flex-1 pb-24">
          {!hideWhereSection && <WhereSection />}
          <DatesSection />
          <TravelersSection />
        </div>

        {/* Footer bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-frui-white border-t border-[#d6c7b9] px-6 py-4 flex justify-between items-center z-10">
          <button
            type="button"
            onClick={formState.handleClearAll}
            className="text-sm font-bold text-frui-blue cursor-pointer bg-transparent border-0 p-0"
          >
            Clean Everything
          </button>

          <button
            type="button"
            onClick={formState.handleSearchSubmit}
            className="flex items-center gap-2 bg-frui-orange text-frui-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm cursor-pointer border-0"
          >
            {!submitButtonText && (
              <Search className="h-4 w-4 text-frui-white" />
            )}
            <span>{submitButtonText || 'Search'}</span>
          </button>
        </div>
      </div>
    </SearchFormMobileContext.Provider>
  );
};

/**
 * SearchFormFields
 *
 * Renders the desktop form input fields inside a grid layout.
 */
export const SearchFormFields: React.FC = () => {
  const { onSubmit } = useSearchForm();
  return (
    <div className="form-grid">
      <SearchFormPlaceField />
      <SearchFormDatesField />
      <SearchFormTravelersField />
      <FormSubmit onClick={onSubmit} />
    </div>
  );
};

/**
 * SearchFormDesktop
 *
 * Desktop search form card layout that connects inputs to the Redux store directly.
 */
export const SearchFormDesktop: React.FC<{ sticky?: boolean }> = ({
  sticky = false,
}) => {
  return (
    <SearchFormProvider>
      <div className={`form-card ${sticky ? 'is-sticky' : ''}`}>
        <SearchFormFields />
      </div>
    </SearchFormProvider>
  );
};

interface SearchFormProps {
  /** Pins the desktop search bar to the top of the viewport on scroll.
   * Only enable this where the page has enough clearance below the bar
   * (e.g. the Home hero) — see SearchForm.css for details. */
  sticky?: boolean;
}

/**
 * SearchForm
 *
 * Root SearchForm component that conditionally renders mobile trigger/modal or desktop layout.
 */
export const SearchForm: React.FC<SearchFormProps> = ({ sticky = false }) => {
  const isMobile = useIsMobile();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="w-full px-4">
          <SearchFormMobileTrigger
            onClick={() => setIsMobileSearchOpen(true)}
          />
        </div>
        <SearchFormMobile
          isOpen={isMobileSearchOpen}
          onClose={() => setIsMobileSearchOpen(false)}
        />
      </>
    );
  }

  return <SearchFormDesktop sticky={sticky} />;
};

export default SearchForm;
