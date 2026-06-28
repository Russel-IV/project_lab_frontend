import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  /** The current active page (1-indexed) */
  currentPage: number;
  /** The total number of pages */
  totalPages: number;
  /** Callback triggered when the page selection changes */
  onPageChange: (page: number) => void;
}

/**
 * Reusable, accessible Pagination component conforming to the design mockup.
 * Displays page numbers, arrows, and ellipses dynamically based on the current page location.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Helper to generate the list of page buttons matching mockup states
  const getPageRange = () => {
    const range: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    if (!showLeftEllipsis && showRightEllipsis) {
      // Near the start: 1, 2, 3, 4, ..., totalPages
      for (let i = 1; i <= 4; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages);
    } else if (showLeftEllipsis && !showRightEllipsis) {
      // Near the end: 1, ..., totalPages - 3, totalPages - 2, totalPages - 1, totalPages
      range.push(1);
      range.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // In the middle: 1, ..., currentPage - 1, currentPage, currentPage + 1, ..., totalPages
      range.push(1);
      range.push('...');
      range.push(currentPage - 1);
      range.push(currentPage);
      range.push(currentPage + 1);
      range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageRange();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-4 py-8 select-none"
    >
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="w-10 h-10 flex items-center justify-center rounded-full text-frui-blue focus:outline-none focus:ring-2 focus:ring-frui-blue disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers and Ellipses */}
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-sm font-medium text-frui-blue/50"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${pageNum}`}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-frui-blue ${
                isActive
                  ? 'bg-frui-blue text-frui-white font-semibold'
                  : 'text-frui-blue bg-transparent'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="w-10 h-10 flex items-center justify-center rounded-full text-frui-blue focus:outline-none focus:ring-2 focus:ring-frui-blue disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
