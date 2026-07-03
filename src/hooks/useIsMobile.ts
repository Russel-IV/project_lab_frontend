import { useState, useEffect } from 'react';

/**
 * useIsMobile
 *
 * Custom hook to detect if the current window viewport width is mobile (less than 768px).
 *
 * @returns {boolean} True if the viewport is mobile, false otherwise.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 767px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
