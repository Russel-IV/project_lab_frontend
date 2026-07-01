import { useState, useEffect } from 'react';

/**
 * useIsMobile
 *
 * Custom hook to detect if the current window viewport width is mobile (less than 768px).
 *
 * @returns {boolean} True if the viewport is mobile, false otherwise.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useIsMobile;
